import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 백엔드 API 호출
    fetch('http://localhost:8080/api/hello')
      .then(response => response.json())
      .then(data => {
        console.log('백엔드에서 받은 데이터:', data);
        setMessage(data.message);
        setLoading(false);
      })
      .catch(error => {
        console.error('에러 발생:', error);
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
          <h2>백엔드 연동 테스트</h2>
          <p style={{ 
            fontSize: '24px', 
            color: 'green', 
            fontWeight: 'bold' 
          }}>
            {message}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;