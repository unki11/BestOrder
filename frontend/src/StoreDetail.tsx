import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Store {
  storeId: number;
  storeName: string;
  zipCode: string;
  address: string;
  phone: string;
  description: string;
  businessHours: string;
  isOpen: boolean;
}

const StoreDetail: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/store/${storeId}`);
        setStore(response.data);
      } catch (error) {
        console.error("Error fetching store detail:", error);
        alert("매장 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (storeId) fetchStoreDetail();
  }, [storeId]);

  if (loading) return <div className="text-center py-20">로딩 중...</div>;
  if (!store) return <div className="text-center py-20">정보를 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white shadow-md rounded-xl border border-gray-100">
      {/* 헤더 섹션: 이름 및 영업 상태 */}
      <div className="flex justify-between items-start border-b pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{store.storeName}</h1>
          <p className="text-gray-500 mt-1">매장 고유 번호: #{store.storeId}</p>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
          store.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {store.isOpen ? '● 영업 중' : '○ 영업 준비 중'}
        </span>
      </div>

      

      {/* 정보 섹션 */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">주소</h3>
            <p className="mt-2 text-gray-800">
              ({store.zipCode}) <br />
              {store.address}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">연락처 및 영업시간</h3>
            <p className="mt-2 text-gray-800 font-medium">{store.phone || '전화번호 정보 없음'}</p>
            <p className="text-gray-600 text-sm mt-1">{store.businessHours || '영업시간 정보 없음'}</p>
          </section>
        </div>

        <section className="pt-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">매장 소개</h3>
          <p className="mt-2 text-gray-700 leading-relaxed whitespace-pre-wrap">
            {store.description || '등록된 소개 내용이 없습니다.'}
          </p>
        </section>
      </div>

      {/* 버튼 섹션 */}
      <div className="mt-10 flex gap-3 border-t pt-8">
        <button
          onClick={() => navigate(`/StoreEdit/${storeId}`)}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
        >
          정보 수정
        </button>
        <button
          onClick={() => navigate('/Test')}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition"
        >
          목록으로
        </button>
      </div>
    </div>
  );
};

export default StoreDetail;