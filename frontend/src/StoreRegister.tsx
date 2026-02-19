import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Store {
  storeName: string;
  zipCode: string;
  address: string;
  phone: string;
  description: string;
  businessHours: string;
  ownerId: number; // 실제 구현 시에는 로그인한 유저 세션에서 가져와야 함
}

const StoreRegister: React.FC = () => {
  const navigate = useNavigate();
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  
  // 1. 초기 상태값 (비어있는 폼)
  const [form, setForm] = useState<Store>({
    storeName: '',
    zipCode: '',
    address: '',
    phone: '',
    description: '',
    businessHours: '',
    ownerId: 1, // MVP 단계에서는 임시 ID 사용
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 3. 등록 요청 (POST)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 백엔드의 @PostMapping("/api/stores")와 연결
      await axios.post('http://localhost:8080/api/store', form);
      alert('매장이 성공적으로 등록되었습니다!');
      navigate('/stores'); // 매장 목록 페이지로 이동
    } catch (error) {
      console.error('Registration error:', error);
      alert('매장 등록에 실패했습니다. 입력 값을 확인해주세요.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg my-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">새로운 매장 등록</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 매장 이름 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">매장명 *</label>
          <input
            type="text"
            name="storeName"
            value={form.storeName}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="예: 베스트오더 강남점"
            required
          />
        </div>

        {/* 주소 검색 섹션 */}
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700">우편번호</label>
            <input
              type="text"
              name="zipCode"
              value={form.zipCode}
              className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-50"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsPostcodeOpen(!isPostcodeOpen)}
            className="mt-6 px-3 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700"
          >
            주소 찾기
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">상세 주소</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="건물명, 층수 등 상세 정보를 입력하세요"
          />
        </div>

        {/* 기타 정보 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">전화번호</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="02-1234-5678"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">영업 시간</label>
            <input
              type="text"
              name="businessHours"
              value={form.businessHours}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="10:00 - 22:00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">매장 소개</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded h-24 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-4 bg-blue-600 text-white font-bold rounded shadow-md hover:bg-blue-700 transition duration-200"
        >
          매장 등록하기
        </button>
      </form>
    </div>
  );
};

export default StoreRegister;