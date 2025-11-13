// src/components/Header.tsx
import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import York_Construction_72_logo from "../../assets/LipSum.svg";
import ProfileDropdown from "../../pages/Profile/Dropdown2"; // 로그인 상태에서만 렌더

const Header = () => {
  const { user } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setOpenDropdown((p) => !p);

  // 드롭다운 바깥 클릭 닫기
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <header className="relative flex items-center px-5 py-3 bg-white border-b border-gray-300">
      {/* 로고 */}
      <Link to="/">
        <div className="flex items-center gap-3">
          <img src={York_Construction_72_logo} alt="Logo" className="w-10" />
          <span className="text-xl font-bold text-black">LipSum</span>
        </div>
      </Link>

      {/* 메뉴 */}
      <nav className="flex ml-10 text-black gap-14">
        <Link className="hover:text-blue-600" to="/community">
          커뮤니티
        </Link>
        <Link className="hover:text-blue-600" to="/exchange">
          거래소
        </Link>
        <Link className="hover:text-blue-600" to="/events">
          이벤트
        </Link>
        <Link className="hover:text-blue-600" to="/contact">
          문의
        </Link>
      </nav>

      {/* 오른쪽 영역 */}
      <div
        className="relative flex items-center gap-3 ml-auto"
        ref={dropdownRef}
      >
        {!user ? (
          // 비로그인 상태
          <>
            <Link to="/login">
              <button className="px-4 py-2 text-white bg-blue-600 rounded cursor-pointer hover:bg-blue-700">
                로그인
              </button>
            </Link>
          </>
        ) : (
          // 로그인 상태
          <>
            {/* 알림 아이콘 */}
            <svg
              className="w-6 h-6 text-gray-700 cursor-pointer hover:text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>

            {/* 프로필 */}
            <button onClick={toggleDropdown}>
              <img
                src="https://avatars.githubusercontent.com/u/108007761?v=4"
                alt="avatar"
                className="object-cover w-10 h-10 rounded-full cursor-pointer"
              />
            </button>

            {openDropdown && (
              <div className="absolute right-0 mt-2">
                <ProfileDropdown />
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
