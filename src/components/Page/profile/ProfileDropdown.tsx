import { Link, useNavigate } from 'react-router-dom';

import { UserCircle, Settings, LogOut, Bookmark, Box, Mailbox } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Avatar from '@/components/global/Avatar';

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
        <div className="flex items-center justify-between px-3 py-2">
          <p className="text-base font-semibold">내 계정</p>
          <Avatar
            name={'프로필 이미지'}
            src={useAuthStore.getState().user?.profileImage || undefined}
          />
        </div>

        <hr className="my-1 border-gray-300" />

        <Link
          to={`/profile/${useAuthStore.getState().user?.customId}`}
          className="px-3 py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-between text-sm"
        >
          <span>프로필</span>
          <UserCircle size={17} />
        </Link>

        <Link
          to="/inventory"
          className="px-3 py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-between text-sm"
        >
          <span>인벤토리</span>
          <Box size={17} />
        </Link>

        <Link
          to="/bookmarks"
          className="px-3 py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-between text-sm"
        >
          <span>북마크</span>
          <Bookmark size={17} />
        </Link>

        <Link
          to="/settings"
          className="px-3 py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-between text-sm"
        >
          <span>설정</span>
          <Settings size={17} />
        </Link>

        <Link
          to="/contact"
          className="px-3 py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-between text-sm"
        >
          <span>문의하기</span>
          <Mailbox size={17} />
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
