import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 1. 인터페이스 정의 (기존 구조 유지 및 주문 금액 속성 임의 추가)
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
  totalPrice?: number; // 화면 표시용 총 가격 (추후 백엔드 DTO에 맞게 수정 필요)
}

interface TableGrp {
  tableGrpId?: number;
  storeId: number;
  tableGrpName: string;
  tableGrpPosition: number;
  tableList: Table[];
}

const TableOrder: React.FC = () => {
  const [storeId] = useState<number>(1); // 실제 운영 시에는 로그인/매장 컨텍스트에서 가져옴
  const [groups, setGroups] = useState<TableGrp[]>([]);
  const [selectedGrpId, setSelectedGrpId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 임의 페이지 이동을 위한 상태 (MAIN, RECEIPT, CLOSE, ORDER)
  const [currentView, setCurrentView] = useState<'MAIN' | 'RECEIPT' | 'CLOSE' | 'ORDER'>('MAIN');
  const [selectedTableForOrder, setSelectedTableForOrder] = useState<Table | null>(null);

  const gridRows = [1, 2, 3, 4, 5, 6];
  const gridCols = [1, 2, 3, 4, 5, 6, 7];

  // 데이터 조회 (기존 로직 차용)
  const fetchTableLayout = async () => {
    setLoading(true);
    try {
      // API 통신 (현재는 테스트를 위해 활성화 시 주석 해제하여 사용하세요)
      const response = await axios.get(`http://localhost:8080/api/order/table/store/1`);
      const data = response.data;
      
      // 테스트용 임의 더미 데이터 세팅 (실제 연동 시 삭제)
      const dummyData: TableGrp[] = [
        {
          tableGrpId: 1, storeId: 1, tableGrpName: "1층 홀", tableGrpPosition: 1,
          tableList: [
            { tableId: 1, storeId: 1, tableGrpId: 1, tableNumber: 1, tableName: "1번", tablePosition: 101, capacity: 4, orderId: 1, status: "0", totalPrice: 45000 },
            { tableId: 2, storeId: 1, tableGrpId: 1, tableNumber: 2, tableName: "2번", tablePosition: 102, capacity: 4, status: "0" , orderId: 2, totalPrice: 0 },
            { tableId: 3, storeId: 1, tableGrpId: 1, tableNumber: 3, tableName: "창가 1", tablePosition: 201, capacity: 4, status: "1",  orderId: 3, totalPrice: 120000 },
          ]
        },
        {
          tableGrpId: 2, storeId: 1, tableGrpName: "2층 룸", tableGrpPosition: 2,
          tableList: []
        }
      ];
      //setGroups(dummyData);
      setGroups(data);
      //if (dummyData.length > 0) setSelectedGrpId(dummyData[0].tableGrpId!);
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

  // 테이블 클릭 시 주문 화면으로 이동
  const handleTableClick = (tableData?: Table) => {
    if (tableData) {
      setSelectedTableForOrder(tableData);
      setCurrentView('ORDER');
    }
  };

  // 테이블 이동 핸들러 (추후 axios 개발을 위한 주석 처리 및 임의 동작)
  const handleMoveTable = async () => {
    alert("테이블 이동 기능이 호출되었습니다. (백엔드 연동 예정)");
    /*
    try {
      const payload = {
        sourceTableId: 1, // 이동 전 테이블
        targetTableId: 2  // 이동 후 테이블
      };
      await axios.post(`http://localhost:8080/api/order/move`, payload);
      fetchTableLayout(); // 성공 시 리스트 갱신
    } catch (error) {
      console.error("테이블 이동 실패", error);
    }
    */
  };

  // 테이블 합산 핸들러 (추후 axios 개발을 위한 주석 처리 및 임의 동작)
  const handleMergeTable = async () => {
    alert("테이블 합산 기능이 호출되었습니다. (백엔드 연동 예정)");
    /*
    try {
      const payload = {
        mainTableId: 1, // 합쳐질 메인 테이블
        subTableIds: [2, 3] // 합칠 대상 테이블들
      };
      await axios.post(`http://localhost:8080/api/order/merge`, payload);
      fetchTableLayout(); // 성공 시 리스트 갱신
    } catch (error) {
      console.error("테이블 합산 실패", error);
    }
    */
  };

  // ------------------------------------------------------------------
  // 임의 페이지 렌더링 영역 (영수증, 마감, 주문 화면)
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

  if (currentView === 'ORDER') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-5">{selectedTableForOrder?.tableName} 주문 페이지 (임의)</h1>
        <button onClick={() => setCurrentView('MAIN')} className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold">테이블 맵으로 돌아가기</button>
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

              return (
                <div 
                  key={pos} 
                  onClick={() => handleTableClick(tableData)}
                  className={`relative rounded-xl border-2 flex flex-col justify-between p-3 transition-all ${
                    tableData 
                      ? 'border-indigo-500 bg-white shadow-sm cursor-pointer hover:bg-indigo-50' 
                      : 'border-dashed border-gray-200 bg-gray-50/50'
                  }`}
                >
                  {tableData && (
                    <>
                      {/* 좌측 상단: 테이블 명 */}
                      <span className="text-sm font-black text-gray-800">
                        {tableData.tableName}
                      </span>
                      
                      {/* 우측 하단: 가격 (가격이 0 초과일 때만 렌더링하도록 처리) */}
                      {tableData.totalPrice ? (
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