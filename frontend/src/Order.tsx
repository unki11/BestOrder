import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

// --- 인터페이스 정의 ---
interface Menu {
  menuId?: number;
  storeId: number;
  menuGrpId: number;
  menuName: string;
  price: number;
  description: string;
  imageUrl: string;
  isAvailable: number;
  useYn: string;
  displayOrder: number;
}

interface MenuGrp {
  menuGrpId: number;
  storeId: number;
  menuGrpName: string;
  menuGrpPosition: number;
  useYn: string;
  menuList: Menu[];
}

// 장바구니용 상태 인터페이스
interface OrderItem {
  menuId: number;
  menuName: string;
  price: number; // 백엔드의 unitPrice를 받아서 사용
  quantity: number;
  options?: string;
  subtotal?: number;
}

// 주문 헤더 정보 인터페이스
interface OrderInfo {
  orderId: number;
  tableId?: number;
  tableName?: string;
  orderStatus?: string;
}

const Order: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // URL에서 파라미터 가져오기
  const existingOrderId = searchParams.get('order_id');
  const newTableId = searchParams.get('table_id'); // 신규 주문 시 테이블 번호 확보
  
  // --- 상태 관리 ---
  const [groups, setGroups] = useState<MenuGrp[]>([]);
  const [selectedGrpId, setSelectedGrpId] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // --- 데이터 불러오기 ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. 메뉴 레이아웃 로드
        const menuResponse = await axios.get(`http://localhost:8080/api/menu/store/1`);
        setGroups(menuResponse.data);
        if (menuResponse.data.length > 0) setSelectedGrpId(menuResponse.data[0].menuGrpId);

        // 2. 파라미터에 order_id가 있다면 기존 주문 정보 로드
        if (existingOrderId) {
          const orderResponse = await axios.get(`http://localhost:8080/api/orders/${existingOrderId}`);
          const orderData = orderResponse.data;
          
          if (orderData) {
            setOrderInfo({
              orderId: orderData.orderId,
              tableId: orderData.tableId,
              tableName: orderData.tableName,
              orderStatus: orderData.orderStatus,
            });

            // 백엔드의 DTO(OrderItemDto)를 프론트엔드 상태에 맞게 변환
            const loadedItems: OrderItem[] = orderData.items.map((item: any) => ({
              menuId: item.menuId,
              menuName: item.menuName,
              price: item.unitPrice, // unitPrice를 price로 맵핑
              quantity: item.quantity,
              options: item.options,
              subtotal: item.subtotal
            }));
            
            setOrderItems(loadedItems);
          }
        }

      } catch (error) {
        console.error("데이터 통신 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [existingOrderId]);

  // --- 이벤트 핸들러 ---

  // 1. 메뉴 클릭 핸들러 (장바구니 추가)
  const handleMenuClick = (menu: Menu) => {
    setOrderItems(prevItems => {
      const existingItem = prevItems.find(item => item.menuId === menu.menuId);
      if (existingItem) {
        return prevItems.map(item =>
          item.menuId === menu.menuId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [{ menuId: menu.menuId!, menuName: menu.menuName, price: menu.price, quantity: 1 }, ...prevItems];
      }
    });
  };

  const totalPrice = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // 2. 취소 핸들러
  const handleCancel = () => {
    if(window.confirm("주문을 취소하시겠습니까?")) {
      navigate(-1); // 이전 페이지(테이블 맵)로 이동
    }
  };

  // 3. 결제 버튼
  const handlePayment = () => {
    if (orderItems.length === 0) return alert("주문할 메뉴를 선택해주세요.");
    navigate('/payment', { 
      state: { 
        orderId: orderInfo?.orderId,
        items: orderItems, 
        totalAmount: totalPrice,
        storeId: groups[0]?.storeId || 1
      } 
    });
  };

  // 4. 주문 버튼 클릭 시 DB 저장 API 호출 (신규 Insert / 기존 Update)
  const handleOrder = async () => {
    if (orderItems.length === 0) return alert("주문할 메뉴를 선택해주세요.");

    // DTO 구조에 맞춰 Payload 작성
    const payload = {
      orderId: orderInfo?.orderId || null, // 없으면 null (신규 주문)
      tableId: orderInfo?.tableId || (newTableId ? Number(newTableId) : null), // 기존 정보나 URL 파라미터에서 추출
      storeId: groups[0]?.storeId || 1, // 현재 매장 ID
      totalAmount: totalPrice,
      items: orderItems.map(item => ({
        menuId: item.menuId,
        menuName: item.menuName,
        quantity: item.quantity,
        unitPrice: item.price,
        subtotal: item.price * item.quantity,
        options: item.options || ''
      }))
    };

    try {
      // POST 요청으로 신규/업데이트 일괄 처리
      await axios.post('http://localhost:8080/api/orders', payload);
      alert("주문이 성공적으로 접수되었습니다.");
      
      // 처리 완료 후 이전 화면(테이블 맵)으로 복귀
      navigate(-1); 
    } catch (error) {
      console.error("주문 처리 중 오류 발생:", error);
      alert("주문을 처리하는 도중 문제가 발생했습니다.");
    }
  };

  const selectedGroup = groups.find(g => g.menuGrpId === selectedGrpId);

  if (loading) return <div className="flex h-screen items-center justify-center text-xl font-bold">로딩 중...</div>;

  return (
    <div className="flex h-screen w-full bg-gray-100 p-4 gap-4 select-none">
      
      {/* ================= 좌측 구역 ================= */}
      <div className="flex flex-col w-1/3 h-full gap-4">
        <div className="flex-1 bg-white border-4 border-orange-400 rounded-xl flex flex-col overflow-hidden shadow-md">
          <div className="bg-orange-400 text-white font-bold py-3 text-center text-xl flex flex-col">
            <span>주문 내역 {orderInfo?.orderId && "(추가 주문)"}</span>
            {orderInfo?.tableName && (
              <span className="text-sm font-medium bg-orange-600 rounded-full mx-auto px-3 mt-1 py-0.5">
                테이블: {orderInfo.tableName}
              </span>
            )}
            {/* 신규 주문 시 파라미터로 넘어온 table_id 표시 (임시 확인용) */}
            {!orderInfo?.tableName && newTableId && (
              <span className="text-sm font-medium bg-orange-600 rounded-full mx-auto px-3 mt-1 py-0.5">
                선택된 테이블 ID: {newTableId}
              </span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-orange-50">
            {orderItems.length === 0 ? (
              <div className="text-gray-400 text-center mt-10">주문 내역이 없습니다.</div>
            ) : (
              orderItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-orange-100">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-lg">{item.menuName}</span>
                    {item.options && <span className="text-xs text-gray-500">{item.options}</span>}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-semibold text-gray-500">{item.quantity}개</div>
                    <div className="font-bold text-orange-600">{(item.price * item.quantity).toLocaleString()}원</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="h-28 bg-pink-300 rounded-xl shadow-md border-4 border-pink-400 flex flex-col justify-center items-center">
          <div className="text-pink-800 font-bold text-lg">총합 금액</div>
          <div className="text-4xl font-black text-white drop-shadow-md">
            {totalPrice.toLocaleString()}원
          </div>
        </div>
      </div>

      {/* ================= 우측 구역 ================= */}
      <div className="flex flex-col w-2/3 h-full gap-4">
        <div className="h-1/4 bg-white border-4 border-blue-600 rounded-xl shadow-md flex flex-col overflow-hidden">
          <div className="bg-blue-600 text-white font-bold py-2 text-center">주문 분류</div>
          <div className="flex-1 grid grid-cols-4 gap-2 p-3 bg-blue-50 overflow-y-auto">
            {groups.map(group => (
              <button
                key={group.menuGrpId}
                onClick={() => setSelectedGrpId(group.menuGrpId)}
                className={`p-2 rounded-lg font-bold text-lg transition-colors ${
                  selectedGrpId === group.menuGrpId 
                  ? 'bg-blue-600 text-white shadow-inner' 
                  : 'bg-white text-blue-800 border-2 border-blue-200 hover:bg-blue-100'
                }`}
              >
                {group.menuGrpName}
              </button>
            ))}
          </div>
        </div>

        <div className="h-3/4 flex gap-4">
          <div className="flex-1 bg-white border-4 border-green-500 rounded-xl shadow-md flex flex-col overflow-hidden">
            <div className="bg-green-500 text-white font-bold py-2 text-center">주문 메뉴</div>
            
            <div className="flex-1 grid grid-cols-3 gap-3 p-4 bg-green-50 overflow-y-auto content-start">
                {!selectedGroup || !selectedGroup.menuList || selectedGroup.menuList.length === 0 ? (
                <div className="col-span-3 flex flex-col items-center justify-center h-full text-gray-400 gap-2 opacity-70">
                    <span className="text-4xl">🍽️</span>
                    <p className="font-bold">등록된 메뉴가 없거나 카테고리를 먼저 선택해주세요.</p>
                </div>
                ) : (
                selectedGroup.menuList.map((menu) => (
                    <button
                    key={menu.menuId}
                    onClick={() => handleMenuClick(menu)}
                    className="bg-white border-2 border-green-300 hover:border-green-500 hover:bg-green-100 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all shadow-sm h-32 active:scale-95"
                    >
                    <div className="font-black text-xl text-gray-800 break-keep text-center">{menu.menuName}</div>
                    <div className="font-bold text-green-700">{(menu.price ?? 0).toLocaleString()}원</div>
                    </button>
                ))
                )}
            </div>
          </div>

          <div className="w-32 flex flex-col gap-4">
            <button onClick={handleCancel} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-black text-xl rounded-xl shadow-md border-b-4 border-gray-700 active:border-b-0 active:translate-y-1 transition-all">
              취소
            </button>
            <button onClick={handlePayment} className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-black text-xl rounded-xl shadow-md border-b-4 border-purple-700 active:border-b-0 active:translate-y-1 transition-all">
              결제
            </button>
            <button onClick={handleOrder} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-xl shadow-md border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all">
              {orderInfo?.orderId ? "추가 주문" : "주문"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;