import { NavLink } from 'react-router-dom';

const menuItems = [
  { label: '프로필', path: '/settings/profile' },
  { label: '계정', path: '/settings/account' },
  { label: '알림', path: '/settings/notifications' },
  { label: '보안', path: '/settings/security' },
];

export const SettingsSidebar = () => {
  return (
    <aside className="w-56 shrink-0">
      <h2 className="text-lg font-semibold text-white mb-4">설정</h2>
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
