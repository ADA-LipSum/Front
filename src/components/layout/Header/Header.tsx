import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

import LipSum_Logo_Black from '@/assets/LipSum-logo-black.svg';
import { Bell } from 'lucide-react';

const Header = () => {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  console.log('Header - isLoggedIn:', isLoggedIn);
  console.log('Header - user:', user);

  return (
    <>
      <div className="w-full h-18 bg-[#ffffff] flex items-center pl-18.25 border-b border-[#d1d0d0]">
        <Link to="/">
          <img src={LipSum_Logo_Black} className="w-40" alt="logo" />
        </Link>

        <div className="flex items-center ml-20 gap-10 text-black font-semibold">
          <Link to="/community" className="hover:text-[#54C46B]">
            커뮤니티
          </Link>
          <Link to="/exchange" className="hover:text-[#54C46B]">
            거래소
          </Link>
          <Link to="/event" className="hover:text-[#54C46B]">
            이벤트
          </Link>
          <Link to="/contact" className="hover:text-[#54C46B]">
            문의
          </Link>
        </div>

        <div className="ml-auto mr-6 flex items-center gap-5">
          {isLoggedIn ? (
            <>
              <div className="w-10 h-10 border-[#ffffff] bg-gray-100 border rounded-sm flex items-center justify-center relative inset-shadow-xs hover:cursor-pointer group">
                <Bell className="w-5 h-5 transition-colors duration-200 group-hover:text-blue-600" />
              </div>
              <Link to={`/profile/${user?.customId}`}>
                <div className="w-12 h-12 rounded-full ml-2 border border-gray-300 overflow-hidden hover:cursor-pointer bg-gray-400">
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

export default Header;
