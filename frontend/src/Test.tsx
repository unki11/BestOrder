import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  //const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setData] = useState({ message: '', status: '' });

  useEffect(() => {
    
    // Axios 사용
    axios.get('http://localhost:8080/api/hello')
      .then(response => {
        // fetch와 달리 response.data에 실제 값이 담깁니다.
        setData(response.data);
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
          <h2>백엔드 연동 테스트</h2>
          <p style={{ 
            fontSize: '24px', 
            color: 'green', 
            fontWeight: 'bold' 
          }}>
            <li>{message.message}</li>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;