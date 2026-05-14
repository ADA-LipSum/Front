import { Link } from 'react-router-dom';

import { UserCircle, CreditCard, Settings, LogOut } from 'lucide-react';

export default function ProfileDropdown() {
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
          to="/payments"
          className="px-3 py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-between text-sm"
        >
          <span>결제 내역</span>
          <CreditCard size={17} />
        </Link>

        <Link
          to="/settings"
          className="px-3 py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-between text-sm"
        >
          <span>계정 관리</span>
          <Settings size={17} />
        </Link>

        <hr className="my-1 border-gray-300" />

        <button className="text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-500 transition flex items-center justify-between text-sm">
          <span>로그아웃</span>
          <LogOut size={17} />
        </button>
      </div>
    </div>
  );
}
