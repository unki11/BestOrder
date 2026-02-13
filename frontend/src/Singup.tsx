import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해 추가
import './index.css'

interface ErrorResponse {
  HttpStatus: string;
  code: string;
  message: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'OWNER'
  });

  const [isUsernameChecked, setIsUsernameChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'username') setIsUsernameChecked(false);
    if (name === 'email') setIsEmailChecked(false);
  };

  // 아이디 중복 체크 함수
  const checkUsername = async () => {
  if (!form.username) return alert('아이디를 입력해주세요.');
  try {
    await axios.get(`http://localhost:8080/api/auth/check-username?username=${form.username}`);
    alert('사용 가능한 아이디입니다.');
    setIsUsernameChecked(true);
  } catch (err) {
  
        const axiosError = err as AxiosError<ErrorResponse>; // 백엔드 DTO 타입 지정
    
        if (axiosError.response) {
          // 백엔드에서 보낸 상세 메시지를 꺼내서 알림창에 띄움
          const serverMessage = axiosError.response.data.message;
          const errorCode = axiosError.response.data.code;
          
          alert(`[${errorCode}] : ${serverMessage}`);
        } else {
          alert("서버와 통신 중 오류가 발생했습니다.");
        }
    }
};

  // 이메일 중복 체크 함수 (동일한 로직)
  const checkEmail = async () => {
    if (!form.email) return alert('이메일을 입력해주세요.');
    try {
        console.log(form.email);
      await axios.get(`http://localhost:8080/api/auth/check-email?email=${form.email}`);
      alert('사용 가능한 이메일입니다.');
      setIsEmailChecked(true);
    } catch (err: any) {
      const serverMessage = err.response?.data?.message || '오류가 발생했습니다.';
      alert(serverMessage); 
      setIsEmailChecked(false);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 최종 방어 로직
    if (!isUsernameChecked || !isEmailChecked) {
      alert('아이디와 이메일 중복 확인을 모두 완료해주세요.');
      return;
    }

    try {
      // 백엔드 UserJoinRequest DTO와 필드명을 맞춰서 전송
      await axios.post('http://localhost:8080/api/auth/join', form);
      
      alert('🎉 회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      navigate('/login'); // 가입 성공 후 로그인 페이지로 리다이렉트
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const serverMessage = axiosError.response?.data.message || "가입 중 알 수 없는 오류가 발생했습니다.";
      alert(`가입 실패: ${serverMessage}`);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>BestOrder 시작하기</h2>
        <p className="signup-subtitle">효율적인 매장 관리의 시작</p>
        
        <form onSubmit={onSubmit} className="signup-form">
          <label>계정 정보</label>
          <div className="input-group">
            <input name="username" placeholder="아이디" onChange={onInputChange} required />
            <button type="button" onClick={checkUsername} className="check-btn">중복확인</button>
          </div>
          {isUsernameChecked && <small className="success-msg">✅ 사용 가능한 아이디입니다.</small>}

          <div className="input-group">
            <input name="email" type="email" placeholder="이메일" onChange={onInputChange} required />
            <button type="button" onClick={checkEmail} className="check-btn">중복확인</button>
          </div>
          {isEmailChecked && <small className="success-msg">✅ 확인된 이메일입니다.</small>}

          <input name="password" type="password" placeholder="비밀번호" onChange={onInputChange} required className="full-input" />

          <label>사용자 정보</label>
          <input name="name" placeholder="이름" onChange={onInputChange} required className="full-input" />
          <input name="phone" placeholder="전화번호 (ex: 01012345678)" onChange={onInputChange} className="full-input" />
          
          <label>권한 설정</label>
          <div className="role-group">
            <label className={`role-item ${form.role === 'OWNER' ? 'active' : ''}`}>
              <input type="radio" name="role" value="OWNER" checked={form.role === 'OWNER'} onChange={onInputChange} />
              사장님
            </label>
            <label className={`role-item ${form.role === 'STAFF' ? 'active' : ''}`}>
              <input type="radio" name="role" value="STAFF" checked={form.role === 'STAFF'} onChange={onInputChange} />
              직원
            </label>
          </div>

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={!isUsernameChecked || !isEmailChecked}
          >
            회원가입 완료
          </button>
        </form>
      </div>
    </div>
  );
};


export default Signup;