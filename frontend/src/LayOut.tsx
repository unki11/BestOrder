import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="admin-container">
      <nav>
        {/* a 태그 대신 Link 사용 (SPA의 핵심) */}
        <Link to="/">홈</Link><br/>
        <Link to="/Test">테스트</Link><br/>
        <Link to="/Login">로그인</Link><br/>
        <Link to="/Signup">회원가입</Link><br/>
        <Link to="/StoreEdit/1">매장 관리</Link><br/>
        <Link to="/StoreRegister">매장 등록</Link><br/>
        <Link to="/Store/1">매장 상세</Link><br/>
      </nav>
      <hr />
      <main>
        {/* 이 자리에 위에서 설정한 Route의 element들이 갈아끼워집니다. */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;