import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

// 1. API 응답 데이터에 대한 인터페이스 정의
interface LoginResponse {
  token: string;
  name: string;
  role: string;
  message?: string; // 에러 메시지 등을 대비
}

// 2. 에러 응답 객체 인터페이스 (선택 사항)
interface ErrorResponse {
  message: string;
}

const Login: React.FC = () => {
  // 상태 타입 정의 (string으로 명시하거나 추론되도록 둠)
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const navigate = useNavigate();

  // 3. 이벤트 타입 정의: React.FormEvent
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      // axios generic에 응답 데이터 인터페이스 적용
      const response = await axios.post<LoginResponse>('http://localhost:8080/api/auth/login', {
        email,
        password,
      });

      const { token, name, role } = response.data;

      // 로컬 스토리지 저장
      localStorage.setItem('token', token);
      localStorage.setItem('userName', name);
      localStorage.setItem('userRole', role);

      alert('로그인 성공!');
      navigate('/main');

    } catch (error) {
      // 4. Axios 에러 핸들링
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || '로그인 중 오류가 발생했습니다.';
      
      alert('로그인 실패: ' + errorMessage);
    }
  };

  return (
    <div className="container">
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;