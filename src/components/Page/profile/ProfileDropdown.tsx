import { Link, useNavigate } from 'react-router-dom';

import { UserCircle, Settings, LogOut, Bookmark, Mail } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function ProfileDropdown() {
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();

    navigate('/');
  };

  return (
    <div className="w-52 bg-white border border-gray-200 rounded-md shadow-lg p-1.5">
      <div className="flex flex-col">
        <p className="px-3 py-2 text-base font-semibold">내 계정</p>

        <hr className="my-1 border-gray-300" />

        <Link
          to="/mypage"
          className="px-3 py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-between text-sm"
        >
          <span>프로필</span>
          <UserCircle size={17} />
        </Link>

        <Link
          to="/settings"
          className="px-3 py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-between text-sm"
        >
          <span>설정</span>
          <Settings size={17} />
        </Link>

        <Link
          to="/bookmarks"
          className="px-3 py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-between text-sm"
        >
          <span>북마크</span>
          <Bookmark size={17} />
        </Link>

        <Link
          to="/contact"
          className="px-3 py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-between text-sm"
        >
          <span>문의하기</span>
          <Mail size={17} />
        </Link>

        <hr className="my-1 border-gray-300" />

        <button
          className="text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-500 transition flex items-center justify-between text-sm"
          onClick={handleLogout}
        >
          <span>로그아웃</span>
          <LogOut size={17} />
        </button>
      </div>
    </div>
  );
}
