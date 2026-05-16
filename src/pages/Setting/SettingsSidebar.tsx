import { Bell, Link, Palette, UserCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const SettingsSidebar = () => {
  return (
    <aside className="w-75">
      <h2 className="text-md font-bold mb-8 text-gray-800">내 계정</h2>

      <div className="space-y-2">
        <NavLink
          to="/settings/profile"
          className={({ isActive }) =>
            `
            flex items-center gap-3
            px-4 py-4
            rounded-xl
            transition-all
            text-gray-700
            ${isActive ? 'bg-[#eceef3]' : 'hover:bg-[#f1f3f6]'}
          `
          }
        >
          <UserCircle size={18} />
          프로필
        </NavLink>

        <NavLink
          to="/settings/account"
          className={({ isActive }) =>
            `
            flex items-center gap-3
            px-4 py-4
            rounded-xl
            transition-all
            text-gray-700
            ${isActive ? 'bg-[#eceef3]' : 'hover:bg-[#f1f3f6]'}
          `
          }
        >
          <Link size={18} />
          연결된 계정
        </NavLink>

        <NavLink
          to="/settings/display"
          className={({ isActive }) =>
            `
            flex items-center gap-3
            px-4 py-4
            rounded-xl
            transition-all
            text-gray-700
            ${isActive ? 'bg-[#eceef3]' : 'hover:bg-[#f1f3f6]'}
          `
          }
        >
          <Palette size={18} />
          디스플레이
        </NavLink>

        <NavLink
          to="/settings/notifications"
          className={({ isActive }) =>
            `
            flex items-center gap-3
            px-4 py-4
            rounded-xl
            transition-all
            text-gray-700
            ${isActive ? 'bg-[#eceef3]' : 'hover:bg-[#f1f3f6]'}
          `
          }
        >
          <Bell size={18} />
          알림 설정
        </NavLink>
      </div>
    </aside>
  );
};
