import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header
      style={{
        display: "flex",
        // justifyContent: "space-between",
        alignItems: "center",
        padding: "5px 20px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* 로고 영역 */}
      <Link to="/">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="/logo.svg"
            alt="Logo"
            style={{ width: "150px", height: "40px" }}
          />
        </div>
      </Link>

      {/* 메뉴 링크 */}
      <nav
        className="header-nav"
        style={{ display: "flex", gap: "57px", color: "black" }}
      >
        <style>{`
          .header-nav a { color: black; text-decoration: none; }
          .header-nav a:hover { color: blue; }
        `}</style>
        <Link to="/community">커뮤니티</Link>
        <Link to="/exchange">거래소</Link>
        <Link to="/events">이벤트</Link>
        <Link to="/contact">문의</Link>
      </nav>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "10px", // <- 여기에 10px 간격 추가
        }}
      >
        {/*  알림 아이콘  */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          {" "}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />{" "}
        </svg>
        {/* 프로필 이미지 */}
        <button
          type="button"
          style={{ cursor: "pointer" }}
          onClick={() => {
            alert("프로필 클릭!");
          }}
        >
          <img
            src="https://avatars.githubusercontent.com/u/108007761?v=4"
            alt="avatar"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
