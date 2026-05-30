import { Routes, Route, Navigate } from 'react-router-dom';
import { SettingsSidebar } from './SettingsSidebar';
import { ProfileSettings } from './ProfileSettings';
import { ConnectedAccountSettings } from './ConnectedAccountSettings';
import { DisplaySettings } from './DisplaySettings';
import { NotificationSettings } from './NotificationSettings';

export const Settings = () => {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="max-w-350 mx-auto flex px-10 py-10 gap-16">
        {/* 왼쪽 사이드바 */}
        <SettingsSidebar />

        {/* 수직 구분선 */}
        <div
          className="
              w-px
              bg-gray-300
              self-stretch
            "
        />

        {/* 오른쪽 컨텐츠 */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/settings/profile" replace />} />

            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/account" element={<ConnectedAccountSettings />} />
            <Route path="/display" element={<DisplaySettings />} />
            <Route path="/notifications" element={<NotificationSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};
