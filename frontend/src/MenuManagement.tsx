import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  menuGrpId?: number;
  storeId: number;
  menuGrpName: string;
  menuGrpPosition: number;
  useYn: string;
  menuList: Menu[];
}

const MenuManagement: React.FC = () => {
  const [inputStoreId, setInputStoreId] = useState<string>('');
  const [currentStoreId, setCurrentStoreId] = useState<number | null>(null);
  const [groups, setGroups] = useState<MenuGrp[]>([]);
  const [selectedGrpId, setSelectedGrpId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // --- 추가/수정 관련 상태 ---
  const [editingGrpId, setEditingGrpId] = useState<number | null>(null);
  const [editGrpName, setEditGrpName] = useState<string>('');
  
  const [editingMenuId, setEditingMenuId] = useState<number | 'new' | null>(null); // 'new'는 신규 등록 중
  const [tempMenu, setTempMenu] = useState<Partial<Menu>>({});

  const fetchMenuLayout = async () => {
    if (!inputStoreId) return alert("매장 번호를 입력해주세요.");
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/menu/store/${inputStoreId}`);
      setGroups(response.data);
      setCurrentStoreId(Number(inputStoreId));
      if (response.data.length > 0 && !selectedGrpId) setSelectedGrpId(response.data[0].menuGrpId);
    } catch (error) {
      alert("데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // --- 유효성 검사 로직 ---
  const validateMenu = (menu: Partial<Menu>) => {
    if (!menu.menuName || menu.menuName.trim() === '') {
      alert("메뉴 이름을 입력해주세요.");
      return false;
    }
    if (menu.price === undefined || menu.price < 0) {
      alert("가격은 0원 이상으로 설정해주세요.");
      return false;
    }
    return true;
  };

  // --- 메뉴 저장 버튼 클릭 시 ---
  const handleConfirmSaveMenu = async () => {
    if (!validateMenu(tempMenu)) return;

    const menuData = {
      ...tempMenu,
      storeId: currentStoreId,
      menuGrpId: selectedGrpId,
      isAvailable: tempMenu.isAvailable ?? 1,
      useYn: 'Y',
      displayOrder: tempMenu.displayOrder ?? 0
    };

    try {
      await axios.post(`http://localhost:8080/api/menu`, menuData);
      alert("저장되었습니다.");
      setEditingMenuId(null);
      setTempMenu({});
      fetchMenuLayout();
    } catch (error) {
      alert("저장에 실패했습니다.");
    }
  };

  // --- 신규 등록 폼 열기 ---
  const openNewMenuForm = () => {
    setEditingMenuId('new');
    setTempMenu({ menuName: '', price: 0, isAvailable: 1 });
  };

  // --- 수정 폼 열기 ---
  const openEditMenuForm = (menu: Menu) => {
    setEditingMenuId(menu.menuId!);
    setTempMenu({ ...menu });
  };

  const handleAddGroup = async () => {
    if (!currentStoreId) return alert("매장을 먼저 조회해주세요.");
    const newGroup = { storeId: currentStoreId, menuGrpName: "새 카테고리", menuGrpPosition: groups.length + 1, useYn: 'Y', createdUser: 1, menuGrpId: null };
    try {
      await axios.post(`http://localhost:8080/api/menu/group`, newGroup);
      fetchMenuLayout();
    } catch (error) { alert("그룹 추가 실패"); }
  };

  const handleRenameGroup = async (group: MenuGrp) => {
    const updatedGroup = { ...group, menuGrpName: editGrpName, updatedUser: 1 };
    try {
      await axios.post(`http://localhost:8080/api/menu/group`, updatedGroup);
      setEditingGrpId(null);
      fetchMenuLayout();
    } catch (error) { alert("변경 실패"); }
  };

  const handleDeleteMenu = async (menuId: number) => {
    if(!window.confirm("삭제하시겠습니까?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/menu/${menuId}?userId=1`);
      fetchMenuLayout();
    } catch (error) { alert("삭제 실패"); }
  };

  const selectedGroup = groups.find(g => g.menuGrpId === selectedGrpId);

  return (
    <div className="max-w-7xl mx-auto my-10 p-6 bg-gray-50 min-h-screen rounded-3xl border border-gray-200 shadow-xl font-sans text-gray-800">
      
      {/* 1. 검색 섹션 */}
      <div className="flex items-center gap-4 mb-10 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex-1">
          <label className="block text-[10px] font-black text-indigo-400 mb-1 ml-1 uppercase tracking-widest">Store Search</label>
          <input
            type="number"
            className="w-full px-4 py-3 border-2 border-gray-50 rounded-xl focus:border-indigo-500 outline-none transition-all font-bold"
            placeholder="매장 ID 입력"
            value={inputStoreId}
            onChange={(e) => setInputStoreId(e.target.value)}
          />
        </div>
        <button onClick={fetchMenuLayout} className="mt-5 px-10 py-3.5 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-all">조회</button>
      </div>

      <div className="flex gap-8">
        {/* 2. 사이드바 */}
        <div className="w-72 flex flex-col gap-3">
          <div className="flex justify-between items-center px-2 mb-2">
            <h3 className="text-xs font-black text-gray-400 tracking-widest uppercase">Categories</h3>
            <button onClick={handleAddGroup} className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg font-bold">+</button>
          </div>
          {groups.map((group) => (
            <div key={group.menuGrpId} className="relative group">
              {editingGrpId === group.menuGrpId ? (
                <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border-2 border-indigo-500">
                  <input autoFocus className="flex-1 px-2 py-1 outline-none font-bold text-sm" value={editGrpName} onChange={(e) => setEditGrpName(e.target.value)} />
                  <button onClick={() => handleRenameGroup(group)} className="text-indigo-600 font-bold">✓</button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedGrpId(group.menuGrpId!)}
                  className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all ${
                    selectedGrpId === group.menuGrpId ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white text-gray-500 hover:bg-indigo-50 border border-transparent shadow-sm'
                  }`}
                >
                  {group.menuGrpName}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 3. 메인 그리드 */}
        <div className="flex-1 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="mb-8 flex justify-between items-center border-b border-gray-50 pb-6">
            <h2 className="text-3xl font-black text-gray-900">{selectedGroup?.menuGrpName || "선택된 구역 없음"}</h2>
            {selectedGroup && editingMenuId === null && (
              <button onClick={openNewMenuForm} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg hover:bg-indigo-700 transition-all">
                + 신규 메뉴 추가
              </button>
            )}
          </div>

          <div className="grid grid-cols-5 gap-4">
            {/* --- 신규 등록 카드 (활성화 시 맨 앞에 표시) --- */}
            {editingMenuId === 'new' && (
              <div className="relative bg-white border-2 border-indigo-500 rounded-2xl p-4 shadow-2xl flex flex-col gap-3 scale-105 z-10">
                <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">New Menu</div>
                <input 
                  placeholder="메뉴명" 
                  className="font-black text-sm outline-none border-b border-gray-100 pb-1"
                  value={tempMenu.menuName}
                  onChange={(e) => setTempMenu({...tempMenu, menuName: e.target.value})}
                />
                <input 
                  type="number" 
                  placeholder="가격" 
                  className="text-xs font-bold outline-none border-b border-gray-100 pb-1"
                  value={tempMenu.price}
                  onChange={(e) => setTempMenu({...tempMenu, price: Number(e.target.value)})}
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={handleConfirmSaveMenu} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-[10px] font-black">저장</button>
                  <button onClick={() => setEditingMenuId(null)} className="flex-1 bg-gray-100 text-gray-400 py-2 rounded-lg text-[10px] font-black">취소</button>
                </div>
              </div>
            )}

            {/* --- 기존 메뉴 리스트 --- */}
            {selectedGroup?.menuList.map((menu) => (
              <div key={menu.menuId} className="group relative bg-white border border-gray-100 rounded-2xl p-4 shadow-sm transition-all hover:border-indigo-100">
                {editingMenuId === menu.menuId ? (
                  /* 수정 모드 */
                  <div className="flex flex-col gap-3">
                    <input 
                      className="font-black text-sm outline-none border-b border-indigo-500"
                      value={tempMenu.menuName}
                      onChange={(e) => setTempMenu({...tempMenu, menuName: e.target.value})}
                    />
                    <input 
                      type="number" 
                      className="text-xs font-bold outline-none border-b border-indigo-500"
                      value={tempMenu.price}
                      onChange={(e) => setTempMenu({...tempMenu, price: Number(e.target.value)})}
                    />
                    <div className="flex gap-1 mt-2">
                      <button onClick={handleConfirmSaveMenu} className="flex-1 bg-indigo-600 text-white py-1.5 rounded-md text-[10px] font-black">저장</button>
                      <button onClick={() => setEditingMenuId(null)} className="flex-1 bg-gray-200 text-gray-500 py-1.5 rounded-md text-[10px] font-black">취소</button>
                    </div>
                  </div>
                ) : (
                  /* 보기 모드 */
                  <div className="flex flex-col gap-2">
                    <button onClick={() => handleDeleteMenu(menu.menuId!)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-all z-20">✕</button>
                    <div className="w-full aspect-square bg-gray-50 rounded-xl mb-1 flex items-center justify-center text-gray-300 text-[10px] overflow-hidden">
                      {menu.imageUrl ? <img src={menu.imageUrl} className="w-full h-full object-cover" alt="" /> : "Image"}
                    </div>
                    <div className="font-black text-sm text-gray-800 truncate">{menu.menuName}</div>
                    <div className="text-indigo-600 font-bold text-xs">{menu.price.toLocaleString()}원</div>
                    <button 
                      onClick={() => openEditMenuForm(menu)}
                      className="mt-2 w-full py-2 bg-gray-50 text-gray-400 text-[10px] font-black rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"
                    >
                      EDIT / 품절관리
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;