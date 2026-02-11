import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="admin-container">
      <nav>
        {/* a 태그 대신 Link 사용 (SPA의 핵심) */}
        <Link to="/">홈</Link>
        <br/><br/>
        <Link to="/Test">테스트</Link>
        <br/><br/>
        <Link to="/Login">로그인</Link>
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