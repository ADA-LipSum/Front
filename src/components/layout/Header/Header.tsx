import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import { useAuthStore } from '@/store/authStore';

import LipSum_Logo_Black from '@/assets/LipSum-logo-black.svg';

import { Bell } from 'lucide-react';

import Avatar from '@/components/global/Avatar';
import ProfileDropdown from '@/components/Page/profile/ProfileDropdown';

export const Header = () => {
  const { isLoggedIn, user } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);

  // 드롭다운 영역 감지용 ref
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // dropdown 영역 밖 클릭 시 닫기
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-18 bg-[#ffffff] flex items-center pl-10 border-b border-[#d1d0d0]">
      <Link to="/">
        <img src={LipSum_Logo_Black} className="w-20" alt="logo" />
      </Link>

      <div className="flex items-center ml-20 gap-10 text-black font-semibold">
        <Link to="/">커뮤니티</Link>
        <Link to="/study-group">그룹 찾기</Link>
        <Link to="/announcement">공지사항</Link>
        <Link to="/exchange">거래소</Link>
        <Link to="/contact">문의</Link>

        {user?.role === 'ADMIN' && <Link to="/dashboard/admin">관리자 대시보드</Link>}
        {user?.role === 'TEACHER' && <Link to="/dashboard/teacher">선생님 대시보드</Link>}
      </div>

      <div className="ml-auto mr-6 flex items-center gap-5">
        {isLoggedIn ? (
          <>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center relative hover:cursor-pointer group border border-gray-300 hover:bg-gray-100">
              <Bell size={20} color="#6b7280" />
            </div>

            {/* 프로필 영역 */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-12 h-12 rounded-full ml-2 border border-gray-300 overflow-hidden hover:cursor-pointer bg-white"
              >
                <Avatar
                  name={'프로필 이미지'}
                  src={user?.profileImage ?? ''}
                  size="full"
                  className="object-cover"
                />
              </button>

              {/* 드롭다운 */}
              {isOpen && (
                <div className="absolute right-0 top-18 z-50">
                  <ProfileDropdown />
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login">
            <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700 transition hover:cursor-pointer">
              로그인
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};
