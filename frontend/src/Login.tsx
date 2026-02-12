import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import type { ChangeEvent, FormEvent } from 'react';

// 1. 응답 데이터 타입 정의 (백엔드 LoginResponse DTO와 일치)
interface LoginResponseData {
  username: string;
  name: string;
  role: 'OWNER' | 'STAFF';
  accessToken: string;
}

// 2. 메시지 상태 타입 정의
interface MessageState {
  text: string;
  type: 'success' | 'error' | '';
}

interface ErrorResponse {
  code: string;
  message: string;
}

const Login: React.FC = () => {
  // 상태 관리: 타입을 명시적으로 지정하여 안정성을 높입니다.
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [token, setToken] = useState<string>('');
  const [message, setMessage] = useState<MessageState>({ text: '', type: '' });

  const { username, password } = formData;

  // 입력값 변경 핸들러: ChangeEvent와 HTMLInputElement 타입을 사용
  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 로그인 제출 핸들러: FormEvent 타입을 사용
  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      // axios.post 뒤에 응답 데이터 타입을 제네릭으로 전달합니다.
      const response = await axios.post<LoginResponseData>('http://localhost:8080/api/auth/login', {
        username,
        password,
      });

      const { accessToken } = response.data;
      setToken(accessToken);
      setMessage({ text: '🎉 로그인 성공!', type: 'success' });
      
    } catch (err) {

      const axiosError = err as AxiosError<ErrorResponse>; // 백엔드 DTO 타입 지정
  
      if (axiosError.response) {
        // 백엔드에서 보낸 상세 메시지를 꺼내서 알림창에 띄움
        const serverMessage = axiosError.response.data.message;
        const errorCode = axiosError.response.data.code;

        
        const errorMsg = serverMessage;
      
      setMessage({ text: `❌ ${errorMsg}`, type: 'error' });
      setToken('');
        
        alert(`[${errorCode}] 로그인 실패: ${serverMessage}`);
      } else {
        alert("서버와 통신 중 오류가 발생했습니다.");
      }
      
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">BestOrder Login</h2>

        {message.text && (
          <div className={`p-4 mb-4 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">아이디</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            로그인
          </button>
        </form>

        {token && (
          <div className="mt-6 p-4 bg-gray-50 border border-dashed border-gray-400 rounded">
            <p className="text-xs font-semibold text-gray-500 mb-1">발급된 Access Token:</p>
            <p className="text-[10px] break-all text-gray-800 font-mono bg-white p-2 border rounded">
              {token}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;