import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

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

function Login() {
  //const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setData] = useState({ message: '', status: '' });
  const [user, setUser] = useState<LoginResponse | null>(null);

  useEffect(() => {
    
    // Axios 사용
    axios.get<LoginResponse>('http://localhost:8080/api/login')
      .then(response => {
        // fetch와 달리 response.data에 실제 값이 담깁니다.
        //setData(response.data.name? { message: `환영합니다, ${response.data.name}님!`, status: 'success' } : { message: '로그인에 실패했습니다.', status: 'error' });
        setUser(response.data);
        console.log(response);
        setLoading(false)
      })
      .catch(error => {
        console.error("데이터를 가져오는 중 에러 발생!", error);
        setLoading(false);
      });
  }, []);

  return (  
    <div className="App">
      <h1>BestOrder 프로젝트</h1>
      {loading ? (
        <p>로딩중...</p>
      ) : (
        <div>
          <h2>로그인 성공</h2>
          <p style={{ 
            fontSize: '24px', 
            color: 'green', 
            fontWeight: 'bold' 
          }}>
            <li>{message.message}</li>
            <li>유저이름</li><li>{user?.name}</li>
            <li>역할</li><li>{user?.role}</li>
            <li>토큰</li><li>{user?.token}</li>
          </p>
        </div>
      )}
    </div>
  );
}

export default Login;