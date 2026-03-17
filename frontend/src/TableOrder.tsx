import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 1. 인터페이스 정의
interface Table {
  tableId?: number;
  storeId: number;
  tableGrpId: number;
  tableNumber: number;
  tableName: string;
  tablePosition: number;
  capacity: number;
  orderId?: number; 
  status: string;
  totalPrice?: number;
}

interface TableGrp {
  tableGrpId?: number;
  storeId: number;
  tableGrpName: string;
  tableGrpPosition: number;
  tableList: Table[];
}

const TableOrder: React.FC = () => {
  const navigate = useNavigate();

  const [storeId] = useState<number>(1);
  const [groups, setGroups] = useState<TableGrp[]>([]);
  const [selectedGrpId, setSelectedGrpId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [currentView, setCurrentView] = useState<'MAIN' | 'RECEIPT' | 'CLOSE'>('MAIN');

  const gridRows = [1, 2, 3, 4, 5, 6];
  const gridCols = [1, 2, 3, 4, 5, 6, 7];

  // 데이터 조회
  const fetchTableLayout = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/order/table/store/1`);
      const data = response.data;
      
      setGroups(data);
      if (data.length > 0) setSelectedGrpId(data[0].tableGrpId!);
    } catch (error) {
      alert("매장 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableLayout();
  }, [storeId]);

  // 테이블 클릭 시 Order 화면으로 이동
  const handleTableClick = (tableData?: Table) => {
    // 1. 아예 데이터가 없는 빈 공간(Null)은 이 함수를 호출하지 않도록 아래 렌더링 부분에서 처리함.
    
    if (tableData) {
      if (tableData.orderId && tableData.tableId) {
        // 2. 이미 진행 중인 주문이 있다면 (orderId O)
        navigate(`/Order/1?order_id=${tableData.orderId}&table_id=${tableData.tableId}`);
      } else if (tableData.tableId) {
        // 3. 등록된 테이블이지만 진행 중인 주문이 없는 경우 (orderId X, tableId O)
        navigate(`/Order/1?table_id=${tableData.tableId}`);
      }
    }
  };

  const handleMoveTable = async () => {
    alert("테이블 이동 기능이 호출되었습니다. (백엔드 연동 예정)");
  };

  const handleMergeTable = async () => {
    alert("테이블 합산 기능이 호출되었습니다. (백엔드 연동 예정)");
  };

  // ------------------------------------------------------------------
  // 임의 페이지 렌더링 영역
  // ------------------------------------------------------------------
  if (currentView === 'RECEIPT') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-5">영수증 조회 페이지 (임의)</h1>
        <button onClick={() => setCurrentView('MAIN')} className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold">뒤로 가기</button>
      </div>
    );
  }

  if (currentView === 'CLOSE') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-5 text-red-600">영업 마감 페이지 (임의)</h1>
        <button onClick={() => setCurrentView('MAIN')} className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold">뒤로 가기</button>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // 메인 테이블 관리 및 주문 맵 화면
  // ------------------------------------------------------------------
  const selectedGroup = groups.find(g => g.tableGrpId === selectedGrpId);

  return (
    <div className="max-w-screen-2xl mx-auto h-screen p-6 bg-gray-50 flex gap-6 font-sans">
      
      {/* 1. 왼쪽 사이드바: 그룹명 목록 */}
      <div className="w-64 flex flex-col gap-3 bg-white p-4 rounded-3xl shadow-md border border-gray-200">
        <h3 className="text-sm font-black text-gray-400 tracking-widest uppercase mb-4 text-center">그룹명</h3>
        {groups.map((group) => (
          <button
            key={group.tableGrpId}
            onClick={() => setSelectedGrpId(group.tableGrpId!)}
            className={`w-full text-center py-5 rounded-2xl font-bold transition-all border-2 ${
              selectedGrpId === group.tableGrpId
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:text-indigo-600'
            }`}
          >
            {group.tableGrpName}
          </button>
        ))}
      </div>

      {/* 2. 중앙 메인: 6x7 테이블 그리드 영역 */}
      <div className="flex-1 bg-white p-6 rounded-3xl shadow-md border border-gray-200 flex flex-col">
        <h2 className="text-2xl font-black text-gray-800 mb-6 border-b pb-4">
          {selectedGroup ? selectedGroup.tableGrpName : "구역을 선택하세요"}
        </h2>
        
        <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-4">
          {gridRows.map(row => 
            gridCols.map(col => {
              const pos = row * 100 + col;
              const tableData = selectedGroup?.tableList.find(t => t.tablePosition === pos);

              // 1) 주문이 있는 테이블 스타일
              const hasOrderStyle = "border-indigo-500 bg-white shadow-sm cursor-pointer hover:bg-indigo-50";
              // 2) 등록된 빈 테이블 스타일
              const emptyTableStyle = "border-gray-300 bg-gray-100 cursor-pointer hover:bg-gray-200";
              // 3) 아예 미등록된 공간(Null) 스타일
              const nullSpaceStyle = "border-dashed border-gray-200 bg-gray-50/50 cursor-default";

              let currentStyle = nullSpaceStyle;
              if (tableData) {
                if (tableData.orderId) {
                  currentStyle = hasOrderStyle;
                } else {
                  currentStyle = emptyTableStyle;
                }
              }

              return (
                <div 
                  key={pos} 
                  // tableData가 있을 때만 클릭 이벤트를 활성화하여 미등록 공간 클릭 방지
                  onClick={tableData ? () => handleTableClick(tableData) : undefined}
                  className={`relative rounded-xl border-2 flex flex-col justify-between p-3 transition-all ${currentStyle}`}
                >
                  {tableData && (
                    <>
                      {/* 좌측 상단: 테이블 명 */}
                      <span className={`text-sm font-black ${tableData.orderId ? 'text-gray-800' : 'text-gray-400'}`}>
                        {tableData.tableName}
                      </span>
                      
                      {/* 우측 하단: 가격 (주문이 있을 때만 렌더링) */}
                      {tableData.orderId && tableData.totalPrice ? (
                        <span className="absolute bottom-3 right-3 text-sm font-bold text-indigo-600">
                          {tableData.totalPrice.toLocaleString()}
                        </span>
                      ) : null}
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. 오른쪽 사이드바: 액션 버튼들 */}
      <div className="w-64 flex flex-col gap-4 bg-white p-4 rounded-3xl shadow-md border border-gray-200 justify-between">
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => setCurrentView('RECEIPT')}
            className="w-full py-8 rounded-2xl font-bold text-gray-700 bg-white border-2 border-gray-300 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            영수증 조회
          </button>
          
          <button 
            onClick={handleMoveTable}
            className="w-full py-8 rounded-2xl font-bold text-gray-700 bg-white border-2 border-gray-300 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            테이블 이동
          </button>
          
          <button 
            onClick={handleMergeTable}
            className="w-full py-8 rounded-2xl font-bold text-gray-700 bg-white border-2 border-gray-300 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            테이블 합산
          </button>
        </div>

        <button 
          onClick={() => setCurrentView('CLOSE')}
          className="w-full py-8 rounded-2xl font-black text-white bg-gray-800 hover:bg-black transition-all shadow-lg mt-auto"
        >
          마감
        </button>
      </div>

    </div>
  );
};

export default TableOrder;