import { Route, Routes } from 'react-router-dom';

import { useEffect } from 'react';

import { useAuthStore } from '@/store/authStore';

import { Exchange } from '@/pages/Exchange/Exchange';
import { Contact } from '@/pages/Contact/Contact';
import { Login } from '@/pages/Auth/Login';
import { SocialLogin } from '@/pages/Auth/SocialLogin';
import MainLayout from '@/components/layout/MainLayout';
import Proifle from './pages/Profile/Profile';
import UserNotFound from './pages/NotFound/UserNotFound';
import { Announcement } from './pages/Announcement/Contact';
import { Settings } from './pages/Setting/Settings';
import { StudyGroup } from './pages/StudyGroup/StudyGroup';
import { Community } from './pages/Community/Community';
import { CommunityPostDetail } from './pages/Community/CommunityPostDetail';
import AdminRoute from './components/layout/AdminRoute';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UsersPage from './pages/Admin/pages/UsersPage';
import BansPage from './pages/Admin/pages/BansPage';
import ReportsPage from './pages/Admin/pages/ReportsPage';
import PostsPage from './pages/Admin/pages/PostsPage';
import NoticesPage from './pages/Admin/pages/NoticesPage';
import CoinsPage from './pages/Admin/pages/CoinsPage';
import ShopPage from './pages/Admin/pages/ShopPage';
import GroupsPage from './pages/Admin/pages/GroupsPage';
import NotificationsPage from './pages/Admin/pages/NotificationsPage';
import S3Page from './pages/Admin/pages/S3Page';
import BannersPage from './pages/Admin/pages/BannersPage';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import { Inventory } from './pages/Inventory/Inventory';
import { Bookmarks } from './pages/Bookmark/Bookmarks';

const Router = () => {
  const checkLogin = useAuthStore((state) => state.checkLogin);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Community />} />
        <Route path="/article/:postId" element={<CommunityPostDetail />} />
        <Route path="/study-group" element={<StudyGroup />} />
        <Route path="/announcement" element={<Announcement />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile/:customId" element={<Proifle />} />
        <Route path="/settings/*" element={<Settings />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
      </Route>

      {/* Admin — standalone layout (no top header) */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/users" element={<UsersPage />} />
          <Route path="/dashboard/admin/bans" element={<BansPage />} />
          <Route path="/dashboard/admin/reports" element={<ReportsPage />} />
          <Route path="/dashboard/admin/posts" element={<PostsPage />} />
          <Route path="/dashboard/admin/notices" element={<NoticesPage />} />
          <Route path="/dashboard/admin/coins" element={<CoinsPage />} />
          <Route path="/dashboard/admin/shop" element={<ShopPage />} />
          <Route path="/dashboard/admin/groups" element={<GroupsPage />} />
          <Route path="/dashboard/admin/notifications" element={<NotificationsPage />} />
          <Route path="/dashboard/admin/s3" element={<S3Page />} />
          <Route path="/dashboard/admin/banners" element={<BannersPage />} />
        </Route>
      </Route>

      <Route path="/not-found/user" element={<UserNotFound />} />
      <Route path="/login" element={<Login />} />
      <Route path="/social-login" element={<SocialLogin />} />
    </Routes>
  );
};

export default Router;
