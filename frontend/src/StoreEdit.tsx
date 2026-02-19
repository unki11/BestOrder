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
  isOpen: boolean;
}

const StoreEdit: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. 초기 데이터 로드 (GET)
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/store/${storeId}`);
        console.log(response.data);
        setStore(response.data);
      } catch (error) {
        alert('매장 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [storeId]);

  // 2. 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!store) return;
    const { name, value } = e.target;
    setStore({ ...store, [name]: value });
  };

  // 3. 수정 요청 (PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/store/${storeId}`, store);
      alert('매장 정보가 성공적으로 수정되었습니다.');
      navigate(`/stores/${storeId}`); // 상세 페이지로 이동
    } catch (error) {
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!store) return <div>매장 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">매장 정보 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">매장명</label>
          <input
            type="text"
            name="storeName"
            value={store.storeName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium">우편번호</label>
            <input
              type="text"
              name="zipCode"
              value={store.zipCode}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <button type="button" className="mt-5 px-4 py-2 bg-blue-500 text-white rounded">
            주소 검색
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium">주소</label>
          <input
            type="text"
            name="address"
            value={store.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">전화번호</label>
          <input
            type="text"
            name="phone"
            value={store.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">매장 설명</label>
          <textarea
            name="description"
            value={store.description}
            onChange={handleChange}
            className="w-full p-2 border rounded h-32"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={store.isOpen}
            onChange={(e) => setStore({ ...store, isOpen: e.target.checked })}
          />
          <label className="text-sm font-medium">현재 영업 중</label>
        </div>

        <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700">
          저장하기
        </button>
      </form>
    </div>
  );
};

export default StoreEdit;