import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';

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

interface OrderItem {
  menuId: number;
  menuName: string;
  price: number;
  quantity: number;
  options?: string;
  subtotal?: number;
}

// 기존 주문 내역(계산서) 조회를 위한 인터페이스 추가
interface OrderHistoryResponse {
  totalAmount: number;
  items: OrderItem[];
}

const OrderMobile: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { storeId } = useParams<{ storeId: string }>();
  const newTableId = searchParams.get('table_id'); 
  
  const [groups, setGroups] = useState<MenuGrp[]>([]);
  const [selectedGrpId, setSelectedGrpId] = useState<number | null>(null);
  
  // 현재 장바구니 상태
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 모바일 전용 UI 상태 관리
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  
  // +++ 추가된 부분: 주문 내역(계산서) 상태 관리 +++
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [historyData, setHistoryData] = useState<OrderHistoryResponse | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);

  // --- 기본 데이터(메뉴) 불러오기 ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const menuResponse = await axios.get(`http://localhost:8080/api/menu/store/${storeId}`);
        setGroups(menuResponse.data);
        if (menuResponse.data.length > 0) {
          setSelectedGrpId(menuResponse.data[0].menuGrpId);
        }
      } catch (error) {
        console.error("데이터 통신 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 이벤트 핸들러 ---
  
  // 장바구니 담기
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

  // 장바구니 수량 조절
  const updateQuantity = (menuId: number, delta: number) => {
    setOrderItems(prevItems => 
      prevItems.map(item => {
        if (item.menuId === menuId) {
          const newQuantity = item.quantity + delta;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 0 };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  // 새로운 주문 접수 (매번 새로운 주문 ID 생성)
  const handleOrder = async () => {
    if (orderItems.length === 0) return alert("주문할 메뉴를 선택해주세요.");

    const payload = {
      orderId: null, // 항상 새로운 주문으로 처리
      tableId: newTableId ? Number(newTableId) : null, 
      storeId: groups[0]?.storeId || 1, 
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
      await axios.post('http://localhost:8080/api/orders/mobile', payload);
      alert("주문이 성공적으로 접수되었습니다.");
      setOrderItems([]); // 장바구니 비우기
      setIsCartOpen(false); // 장바구니 닫기
    } catch (error) {
      console.error("주문 처리 중 오류 발생:", error);
      alert("주문을 처리하는 도중 문제가 발생했습니다.");
    }
  };

  // +++ 추가된 부분: 기존 테이블 주문 내역 조회 핸들러 +++
  const handleOpenHistory = async () => {
    setIsHistoryOpen(true);
    
    if (!newTableId) return; // 테이블 정보가 없으면 조회 불가

    setIsHistoryLoading(true);
    try {
      // 테이블 단위로 현재 진행 중(미결제)인 모든 주문을 합산해서 가져오는 API 가정
      const response = await axios.get(`http://localhost:8080/api/orders/table/${newTableId}/current`);
      setHistoryData(response.data);
    } catch (error) {
      console.error("주문 내역 조회 실패:", error);
      // 백엔드 API가 아직 없을 경우를 대비한 더미 데이터 세팅 (테스트용)
      // setHistoryData({ totalAmount: 0, items: [] });
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const totalPrice = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItemCount = orderItems.reduce((acc, item) => acc + item.quantity, 0);
  const selectedGroup = groups.find(g => g.menuGrpId === selectedGrpId);

  if (loading) return <div className="flex h-screen items-center justify-center text-xl font-bold text-orange-500">메뉴를 불러오는 중...</div>;

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 relative select-none">
      
      {/* 1. 상단 헤더 영역 */}
      <header className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-10">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {/* 작대기 3개 (햄버거) 아이콘 */}
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-black text-gray-800">
          {newTableId ? `테이블 ${newTableId}` : '메뉴 주문'}
        </h1>
        
        {/* +++ 추가된 부분: 주문 내역(영수증) 아이콘 +++ */}
        <button 
          onClick={handleOpenHistory}
          className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center relative"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      </header>

      {/* 2. 메인 메뉴 리스트 영역 */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedGroup?.menuGrpName || '전체 메뉴'}</h2>
        
        {!selectedGroup || !selectedGroup.menuList || selectedGroup.menuList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
            <span className="text-4xl">🍽️</span>
            <p className="font-bold">등록된 메뉴가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {selectedGroup.menuList.map((menu) => (
              <button
                key={menu.menuId}
                onClick={() => handleMenuClick(menu)}
                className="bg-white border border-gray-200 hover:border-orange-500 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all shadow-sm active:scale-95"
              >
                <div className="w-full aspect-square bg-orange-50 rounded-xl flex items-center justify-center mb-2 text-3xl">
                  🍲
                </div>
                <div className="font-bold text-gray-800 text-center break-keep leading-tight">{menu.menuName}</div>
                <div className="font-black text-orange-600">{(menu.price ?? 0).toLocaleString()}원</div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* 3. 좌측 슬라이드 메뉴 그룹 (사이드바) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 bg-orange-500 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">카테고리</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-white hover:text-orange-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {groups.map(group => (
            <button
              key={group.menuGrpId}
              onClick={() => {
                setSelectedGrpId(group.menuGrpId);
                setIsSidebarOpen(false);
              }}
              className={`p-4 rounded-xl text-left font-bold text-lg transition-colors ${
                selectedGrpId === group.menuGrpId 
                ? 'bg-orange-100 text-orange-600' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {group.menuGrpName}
            </button>
          ))}
        </div>
      </div>

      {/* 4. 우측 하단 장바구니 플로팅 버튼 */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-orange-500 text-white rounded-full p-4 shadow-[0_8px_16px_rgba(249,115,22,0.4)] z-30 active:scale-95 transition-transform flex items-center justify-center"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {totalItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black w-7 h-7 flex items-center justify-center rounded-full border-2 border-white">
            {totalItemCount}
          </span>
        )}
      </button>

      {/* 5. 장바구니 바텀 시트 */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 transition-opacity backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        />
      )}
      <div className={`fixed bottom-0 inset-x-0 bg-white rounded-t-3xl shadow-2xl z-50 transform transition-transform duration-300 flex flex-col max-h-[85vh] ${isCartOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            장바구니 <span className="text-orange-500 text-lg">{totalItemCount}</span>
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
          {orderItems.length === 0 ? (
            <div className="text-gray-400 text-center mt-10 font-medium">장바구니가 비어있습니다.</div>
          ) : (
            orderItems.map((item, idx) => (
              <div key={idx} className="flex flex-col bg-white p-4 rounded-2xl shadow-sm border border-gray-100 gap-3">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-gray-800 text-lg">{item.menuName}</span>
                  <button onClick={() => updateQuantity(item.menuId, -item.quantity)} className="text-gray-400 hover:text-red-500 text-sm">삭제</button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="font-black text-orange-600 text-lg">{(item.price * item.quantity).toLocaleString()}원</div>
                  <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1 px-2">
                    <button onClick={() => updateQuantity(item.menuId, -1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-full shadow-sm font-black">-</button>
                    <span className="w-6 text-center font-bold text-gray-800">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.menuId, 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-full shadow-sm font-black">+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-5 bg-white border-t border-gray-100 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-gray-500 font-bold">총 주문금액</span>
            <span className="text-3xl font-black text-gray-800">{totalPrice.toLocaleString()}원</span>
          </div>
          <button 
            onClick={handleOrder} 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-xl py-4 rounded-2xl shadow-md active:scale-95 transition-all"
          >
            주문하기
          </button>
        </div>
      </div>

      {/* 6. +++ 추가된 부분: 주문 내역(계산서) 바텀 시트 +++ */}
      {isHistoryOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 transition-opacity backdrop-blur-sm"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}
      <div className={`fixed bottom-0 inset-x-0 bg-white rounded-t-3xl shadow-2xl z-50 transform transition-transform duration-300 flex flex-col max-h-[85vh] h-full ${isHistoryOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-800 rounded-t-3xl text-white">
          <h2 className="text-2xl font-black flex items-center gap-2">
            주문 내역 <span className="text-sm font-medium text-gray-300 ml-2">테이블 {newTableId}</span>
          </h2>
          <button onClick={() => setIsHistoryOpen(false)} className="p-2 text-gray-300 hover:text-white bg-gray-700 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
          {isHistoryLoading ? (
            <div className="flex items-center justify-center h-full text-gray-500 font-bold">
              주문 내역을 불러오는 중...
            </div>
          ) : !historyData || !historyData.items || historyData.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="font-bold">아직 주문하신 내역이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {historyData.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-lg">{item.menuName}</span>
                    <span className="text-gray-400 text-sm">{item.price.toLocaleString()}원</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-600">{item.quantity}개</span>
                    <span className="font-black text-gray-800 w-20 text-right">
                      {((item.subtotal) || (item.price * item.quantity)).toLocaleString()}원
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 bg-white border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-bold text-lg">총 누적 금액</span>
            <span className="text-3xl font-black text-orange-600">
              {(historyData?.totalAmount || 0).toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default OrderMobile;