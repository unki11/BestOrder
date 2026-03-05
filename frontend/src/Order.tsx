import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

// 주문 내역(장바구니)용 인터페이스 (수량 추가)
interface OrderItem extends Menu {
  quantity: number;
}

const Order: React.FC = () => {
  const navigate = useNavigate();
  
  // --- 상태 관리 ---
  const [groups, setGroups] = useState<MenuGrp[]>([]);
  const [selectedGrpId, setSelectedGrpId] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // --- 데이터 불러오기 ---
  useEffect(() => {
    const fetchMenuLayout = async () => {
      setLoading(true);
      try {
        // 실제 백엔드 연동 시 아래 주석을 해제하고 임시 데이터를 지워주세요.
        
        const response = await axios.get(`http://localhost:8080/api/menu/store/1`);
        setGroups(response.data);
        if (response.data.length > 0) setSelectedGrpId(response.data[0].menuGrpId);
        console.log("메뉴 그룹과 메뉴 데이터를 성공적으로 불러왔습니다:", response.data);

        // ---------------- 임시 데이터 시작 ----------------
        // const dummyData: MenuGrp[] = [
        //   {
        //     menuGrpId: 1, storeId: 1, menuGrpName: '커피', menuGrpPosition: 1, useYn: 'Y',
        //     menuList: [
        //       { menuId: 101, storeId: 1, menuGrpId: 1, menuName: '아메리카노', price: 2000, description: '', imageUrl: '', isAvailable: 1, useYn: 'Y', displayOrder: 1 },
        //       { menuId: 102, storeId: 1, menuGrpId: 1, menuName: '카페라떼', price: 3000, description: '', imageUrl: '', isAvailable: 1, useYn: 'Y', displayOrder: 2 },
        //       { menuId: 103, storeId: 1, menuGrpId: 1, menuName: '바닐라라떼', price: 3500, description: '', imageUrl: '', isAvailable: 1, useYn: 'Y', displayOrder: 3 },
        //     ]
        //   },
        //   {
        //     menuGrpId: 2, storeId: 1, menuGrpName: '디저트', menuGrpPosition: 2, useYn: 'Y',
        //     menuList: [
        //       { menuId: 201, storeId: 1, menuGrpId: 2, menuName: '치즈케이크', price: 5000, description: '', imageUrl: '', isAvailable: 1, useYn: 'Y', displayOrder: 1 },
        //       { menuId: 202, storeId: 1, menuGrpId: 2, menuName: '초코머핀', price: 3000, description: '', imageUrl: '', isAvailable: 1, useYn: 'Y', displayOrder: 2 },
        //     ]
        //   }
        // ];
        // setGroups(dummyData);
        // if (dummyData.length > 0) setSelectedGrpId(dummyData[0].menuGrpId);
        // ---------------- 임시 데이터 끝 ----------------

      } catch (error) {
        console.error("데이터를 불러오지 못했습니다.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuLayout();
  }, []);

  // --- 이벤트 핸들러 ---
  
  // 1. 주문 메뉴 클릭 시 (왼쪽 주문 내역에 추가)
  const handleMenuClick = (menu: Menu) => {
    setOrderItems(prevItems => {
      const existingItem = prevItems.find(item => item.menuId === menu.menuId);
      if (existingItem) {
        // 이미 있는 메뉴면 수량 증가
        return prevItems.map(item =>
          item.menuId === menu.menuId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // 새로운 메뉴면 내역 상단에 추가 (위에서부터 하나씩 들어가게)
        return [{ ...menu, quantity: 1 }, ...prevItems];
      }
    });
  };

  // 총합 금액 계산
  const totalPrice = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // 2. 취소 버튼 (앞 화면으로 이동, 파라미터는 선택적)
  const handleCancel = () => {
    if(window.confirm("주문을 취소하시겠습니까?")) {
      navigate(-1); // 이전 페이지로 이동
      // navigate('/home'); // 특정 경로로 이동하려면 이렇게 사용
    }
  };

  // 3. 결제 버튼 (결제 페이지로 주문 정보 전달)
  const handlePayment = () => {
    if (orderItems.length === 0) return alert("주문할 메뉴를 선택해주세요.");
    
    // 파라미터(state)를 담아서 이동
    navigate('/payment', { 
      state: { 
        items: orderItems, 
        totalAmount: totalPrice,
        storeId: groups[0]?.storeId || 1
      } 
    });
  };

  // 4. 주문 버튼 (주문 완료 또는 확인 페이지로 이동)
  const handleOrder = () => {
    if (orderItems.length === 0) return alert("주문할 메뉴를 선택해주세요.");
    
    navigate('/order-confirm', { 
      state: { 
        items: orderItems, 
        totalAmount: totalPrice
      } 
    });
  };

  // 현재 선택된 카테고리의 메뉴 리스트
  const selectedGroup = groups.find(g => g.menuGrpId === selectedGrpId);

  return (
    <div className="flex h-screen w-full bg-gray-100 p-4 gap-4 select-none">
      
      {/* ================= 좌측 구역 ================= */}
      <div className="flex flex-col w-1/3 h-full gap-4">
        
        {/* 주문 내역 (오렌지색 계열 대체 - 가독성을 위해 흰 바탕에 오렌지 보더 사용) */}
        <div className="flex-1 bg-white border-4 border-orange-400 rounded-xl flex flex-col overflow-hidden shadow-md">
          <div className="bg-orange-400 text-white font-bold py-3 text-center text-xl">
            주문 내역
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-orange-50">
            {orderItems.length === 0 ? (
              <div className="text-gray-400 text-center mt-10">주문 내역이 없습니다.</div>
            ) : (
              orderItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-orange-100">
                  <div className="font-bold text-gray-800 text-lg">{item.menuName}</div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-semibold text-gray-500">{item.quantity}개</div>
                    <div className="font-bold text-orange-600">{(item.price * item.quantity).toLocaleString()}원</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 총합 금액 (핑크색 계열) */}
        <div className="h-28 bg-pink-300 rounded-xl shadow-md border-4 border-pink-400 flex flex-col justify-center items-center">
          <div className="text-pink-800 font-bold text-lg">총합 금액</div>
          <div className="text-4xl font-black text-white drop-shadow-md">
            {totalPrice.toLocaleString()}원
          </div>
        </div>

      </div>

      {/* ================= 우측 구역 ================= */}
      <div className="flex flex-col w-2/3 h-full gap-4">
        
        {/* 주문 분류 (파란색 계열) */}
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

        {/* 하단 (주문 메뉴 + 기능 버튼) */}
        <div className="h-3/4 flex gap-4">
          
          {/* 주문 메뉴 (초록색 계열) */}
          <div className="flex-1 bg-white border-4 border-green-500 rounded-xl shadow-md flex flex-col overflow-hidden">
            <div className="bg-green-500 text-white font-bold py-2 text-center">주문 메뉴</div>
            
            <div className="flex-1 grid grid-cols-3 gap-3 p-4 bg-green-50 overflow-y-auto content-start">
                {/* 1. 카테고리 자체가 선택되지 않았거나 메뉴 리스트가 없을 경우 */}
                {!selectedGroup || !selectedGroup.menuList || selectedGroup.menuList.length === 0 ? (
                <div className="col-span-3 flex flex-col items-center justify-center h-full text-gray-400 gap-2 opacity-70">
                    <span className="text-4xl">🍽️</span>
                    <p className="font-bold">등록된 메뉴가 없거나</p>
                    <p className="text-sm">카테고리를 먼저 선택해주세요.</p>
                </div>
                ) : (
                /* 2. 메뉴 데이터가 있을 경우 렌더링 */
                selectedGroup.menuList.map((menu) => (
                    <button
                    key={menu.menuId}
                    onClick={() => handleMenuClick(menu)}
                    className="bg-white border-2 border-green-300 hover:border-green-500 hover:bg-green-100 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all shadow-sm h-32 active:scale-95"
                    >
                    <div className="font-black text-xl text-gray-800 break-keep text-center">
                        {menu.menuName}
                    </div>
                    <div className="font-bold text-green-700">
                        {(menu.price ?? 0).toLocaleString()}원
                    </div>
                    </button>
                ))
                )}
            </div>
            </div>

          {/* 우측 하단 조작 버튼 (보라색 계열) */}
          <div className="w-32 flex flex-col gap-4">
            <button 
              onClick={handleCancel}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-black text-xl rounded-xl shadow-md border-b-4 border-gray-700 active:border-b-0 active:translate-y-1 transition-all"
            >
              취소
            </button>
            <button 
              onClick={handlePayment}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-black text-xl rounded-xl shadow-md border-b-4 border-purple-700 active:border-b-0 active:translate-y-1 transition-all"
            >
              결제
            </button>
            <button 
              onClick={handleOrder}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-xl shadow-md border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all"
            >
              주문
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Order;