import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 1. 인터페이스 정의
interface Table {
  tableId?: number;
  storeId: number;
  tableGrpId: number;
  tableNumber: number;
  tableName: string;
  tablePosition: number;
  capacity: number;
  status: string;
}

interface TableGrp {
  tableGrpId?: number;
  storeId: number;
  tableGrpName: string;
  tableGrpPosition: number;
  tableList: Table[];
}

const TableManagement: React.FC = () => {
  const [inputStoreId, setInputStoreId] = useState<string>(''); 
  const [currentStoreId, setCurrentStoreId] = useState<number | null>(null);
  const [groups, setGroups] = useState<TableGrp[]>([]);
  const [selectedGrpId, setSelectedGrpId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 그룹 수정을 위한 상태
  const [editingGrpId, setEditingGrpId] = useState<number | null>(null);
  const [editGrpName, setEditGrpName] = useState<string>('');

  const gridRows = [1, 2, 3, 4, 5, 6];
  const gridCols = [1, 2, 3, 4, 5, 6, 7];

  // 데이터 조회
  const fetchTableLayout = async () => {
    if (!inputStoreId) return alert("매장 번호를 입력해주세요.");
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/table/store/${inputStoreId}`);
      const data = response.data;
      setGroups(data);
      setCurrentStoreId(Number(inputStoreId));
      if (data.length > 0) setSelectedGrpId(data[0].tableGrpId);
    } catch (error) {
      alert("매장 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 그룹 추가
  const handleAddGroup = async () => {
    if (!currentStoreId) return alert("매장을 먼저 조회해주세요.");
    
    const newGroup = {
      storeId: currentStoreId,
      tableGrpName: "새 구역",
      tableGrpPosition: groups.length + 1
    };

    try {
      await axios.post(`http://localhost:8080/api/table/group`, newGroup);
      fetchTableLayout();
    } catch (error) {
      alert("그룹 추가 실패");
    }
  };

  // 그룹 이름 수정 저장
  const handleRenameGroup = async (group: TableGrp) => {
    if (!editGrpName.trim()) {
      setEditingGrpId(null);
      return;
    }

    const updatedGroup = {
      ...group,
      tableGrpName: editGrpName
    };

    try {
      await axios.post(`http://localhost:8080/api/table/group`, updatedGroup);
      setEditingGrpId(null);
      fetchTableLayout();
    } catch (error) {
      alert("이름 변경 실패");
    }
  };

  // 테이블 정보 저장 (Upsert)
  const handleTableNameSave = async (pos: number, newName: string, existingTable?: Table) => {
    if (!currentStoreId || !selectedGrpId) return;

    const tableData: Table = {
      ...existingTable,
      storeId: currentStoreId,
      tableGrpId: selectedGrpId,
      tableNumber: pos,
      tableName: newName,
      tablePosition: pos,
      capacity: existingTable?.capacity || 4,
      status: existingTable?.status || 'EMPTY'
    };

    try {
      await axios.post(`http://localhost:8080/api/table`, tableData);
      fetchTableLayout();
    } catch (error) {
      console.error("저장 실패");
    }
  };

  const selectedGroup = groups.find(g => g.tableGrpId === selectedGrpId);

  return (
    <div className="max-w-7xl mx-auto my-10 p-6 bg-gray-50 min-h-screen rounded-3xl border border-gray-200 shadow-xl font-sans">
      
      {/* 1. 상단: 매장 검색 섹션 */}
      <div className="flex items-center gap-4 mb-10 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex-1">
          <label className="block text-[10px] font-black text-indigo-400 mb-1 ml-1 uppercase tracking-widest">Store Search</label>
          <input
            type="number"
            placeholder="매장 고유 ID 입력 (예: 1)"
            className="w-full px-4 py-3 border-2 border-gray-50 rounded-xl focus:border-indigo-500 outline-none transition-all font-bold text-gray-700"
            value={inputStoreId}
            onChange={(e) => setInputStoreId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchTableLayout()}
          />
        </div>
        <button 
          onClick={fetchTableLayout} 
          className="mt-5 px-10 py-3.5 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
        >
          조회하기
        </button>
      </div>

      <div className="flex gap-8">
        {/* 2. 왼쪽 사이드바: 그룹 목록 및 관리 */}
        <div className="w-80 flex flex-col gap-3">
          <div className="flex justify-between items-center px-2 mb-2">
            <h3 className="text-xs font-black text-gray-400 tracking-widest uppercase">Groups</h3>
            <button 
              onClick={handleAddGroup}
              className="w-8 h-8 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-lg font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              title="그룹 추가"
            >
              +
            </button>
          </div>

          {groups.length === 0 && !loading && (
            <div className="text-gray-300 text-sm p-8 text-center border-2 border-dashed rounded-2xl bg-white/50">
              조회된 그룹이 없습니다.
            </div>
          )}

          {groups.map((group) => (
            <div key={group.tableGrpId} className="relative group">
              {editingGrpId === group.tableGrpId ? (
                /* 그룹 이름 편집 모드 */
                <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border-2 border-indigo-500 shadow-xl z-10 relative">
                  <input
                    autoFocus
                    className="flex-1 px-2 py-1 outline-none font-bold text-gray-700 text-sm"
                    value={editGrpName}
                    onChange={(e) => setEditGrpName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRenameGroup(group)}
                  />
                  <button onClick={() => handleRenameGroup(group)} className="w-7 h-7 flex items-center justify-center bg-green-50 text-green-600 rounded-md font-bold text-sm">✓</button>
                  <button onClick={() => setEditingGrpId(null)} className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-400 rounded-md font-bold text-sm">✕</button>
                </div>
              ) : (
                /* 그룹 이름 일반 모드 */
                <div className="flex items-center">
                  <button
                    onClick={() => setSelectedGrpId(group.tableGrpId!)}
                    className={`flex-1 text-left px-5 py-4 rounded-2xl font-bold transition-all truncate pr-12 ${
                      selectedGrpId === group.tableGrpId
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-1'
                        : 'bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 border border-transparent shadow-sm'
                    }`}
                  >
                    {group.tableGrpName}
                  </button>
                  <button 
                    onClick={() => { setEditingGrpId(group.tableGrpId!); setEditGrpName(group.tableGrpName); }}
                    className={`absolute right-3 p-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      selectedGrpId === group.tableGrpId ? 'bg-indigo-500 text-white opacity-100' : 'bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    ✎ Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 3. 오른쪽 메인: 6x7 테이블 그리드 영역 */}
        <div className="flex-1 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="mb-10 border-b border-gray-50 pb-6 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                {selectedGroup ? selectedGroup.tableGrpName : "구역을 선택하세요"}
              </h2>
              <p className="text-gray-400 text-sm mt-2 font-medium">좌표를 클릭하여 테이블을 배치하세요 (101-607)</p>
            </div>
            {selectedGroup && (
              <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest">
                Active: {selectedGroup.tableList.length}
              </div>
            )}
          </div>

          <div className="grid grid-cols-7 gap-5">
            {gridRows.map(row => 
              gridCols.map(col => {
                const pos = row * 100 + col;
                const tableData = selectedGroup?.tableList.find(t => t.tablePosition === pos);

                return (
                  <div 
                    key={pos} 
                    className={`relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-3 transition-all ${
                      tableData 
                        ? 'border-indigo-500 bg-white shadow-md shadow-indigo-50 ring-4 ring-indigo-50/50' 
                        : 'border-dashed border-gray-100 bg-gray-50/30 hover:bg-white hover:border-indigo-200 hover:shadow-inner'
                    }`}
                  >
                    <span className="absolute top-2 left-3 text-[9px] font-black text-gray-300 tracking-tighter">
                      {pos}
                    </span>
                    
                    <input
                      type="text"
                      placeholder="+"
                      defaultValue={tableData?.tableName || ''}
                      className={`w-full bg-transparent text-center font-black text-gray-800 placeholder:text-gray-200 focus:outline-none ${
                        tableData ? 'text-base' : 'text-xs'
                      }`}
                      onBlur={(e) => {
                        if (e.target.value !== (tableData?.tableName || '')) {
                          handleTableNameSave(pos, e.target.value, tableData);
                        }
                      }}
                    />

                    {tableData && (
                      <div className="mt-2 px-2 py-0.5 bg-gray-900 text-white text-[8px] font-black rounded-md uppercase tracking-widest scale-90">
                        {tableData.status}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableManagement;