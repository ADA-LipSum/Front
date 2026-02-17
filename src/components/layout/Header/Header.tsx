import { Link } from 'react-router-dom';

import LipSum_Logo_Black from '@/assets/LipSum-logo-black.svg';
import { Bell } from 'lucide-react';

type HeaderProps = {
  // 로그인 상태를 나타내는 prop (예: isLoggedIn)
  isLoggedIn: boolean;
};

const Header = ({ isLoggedIn }: HeaderProps) => {
  return (
    <div className="w-full h-20 bg-[#F5F5F5] flex items-center pl-18.25 border-b border-[#9C9C9C]">
      {/* 로고 */}
      <Link to="/">
        <img src={LipSum_Logo_Black} className="w-40" alt="logo" />
      </Link>

      {/* 메뉴 영역 */}
      <div className="flex items-center ml-20 gap-10 text-black font-semibold">
        <Link to="/community">커뮤니티</Link>
        <Link to="/exchange">거래소</Link>
        <Link to="/event">이벤트</Link>
        <Link to="/contact">문의</Link>
      </div>

      <div className="ml-auto mr-6 flex items-center gap-5">
        {isLoggedIn ? (
          <>
            <Bell className="w-6 h-6 cursor-pointer hover:text-blue-600" />
            <img
              src="https://api.dicebear.com/9.x/identicon/svg?seed=a9739cf1d10211f0bd93862ccfb0399f"
              className="w-12 h-12 rounded-full ml-2 border border-gray-300 hover:cursor-pointer"
            />
          </>
        ) : (
          <Link to="/login">
            <button className="px-4 py-2 bg-gray-300 text-black font-semibold rounded hover:bg-gray-400 transition hover:cursor-pointer">
              로그인
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
