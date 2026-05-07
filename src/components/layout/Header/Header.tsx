import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

import LipSum_Logo_Black from '@/assets/LipSum-logo-black.svg';
import { Bell } from 'lucide-react';

export const Header = () => {
  const { isLoggedIn, user } = useAuthStore();

  return (
    <>
      <div className="w-full h-18 bg-[#ffffff] flex items-center pl-10 border-b border-[#d1d0d0]">
        <Link to="/">
          <img src={LipSum_Logo_Black} className="w-20" alt="logo" />
        </Link>

        <div className="flex items-center ml-20 gap-10 text-black font-semibold">
          <Link to="/community">커뮤니티</Link>
          <Link to="/study-group">그룹 찾기</Link>
          <Link to="/announcement">공지사항</Link>
          <Link to="/exchange">거래소</Link>
          <Link to="/contact">문의</Link>
        </div>

        <div className="ml-auto mr-6 flex items-center gap-5">
          {isLoggedIn ? (
            <>
              <div className="w-10 h-10 rounded-sm flex items-center justify-center relative hover:cursor-pointer group border border-gray-200">
                <Bell
                  className="transition-colors duration-200 group-hover:text-blue-600"
                  size={20}
                />
              </div>
              <Link to={`/profile/${user?.customId}`}>
                <div className="w-12 h-12 rounded-full ml-2 border border-gray-300 overflow-hidden hover:cursor-pointer bg-white">
                  <img
                    src={user?.profileImage}
                    className="w-full h-full object-cover"
                    alt="profile"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </Link>
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
    </>
  );
};
