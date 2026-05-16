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
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminRoute from './components/layout/AdminRoute';
import TeacherRoute from './pages/Teacher/TeacherDashboard';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';

const Router = () => {
  const checkLogin = useAuthStore((state) => state.checkLogin);

  useEffect(() => {
    checkLogin(); // 새로고침 시 로그인 상태 확인
  }, [checkLogin]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* <Route path="/" element={<Main />} /> */}
        <Route path="/" element={<Community />} />
        <Route path="/article/:postId" element={<CommunityPostDetail />} />
        <Route path="/study-group" element={<StudyGroup />} />
        <Route path="/announcement" element={<Announcement />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile/:customId" element={<Proifle />} />
        <Route path="/settings/*" element={<Settings />} />
        <Route element={<AdminRoute />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
        </Route>
        <Route element={<TeacherRoute />}>
          <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
        </Route>
      </Route>
      <Route path="/not-found/user" element={<UserNotFound />} />

      {/* 로그인 페이지 */}
      <Route path="/login" element={<Login />} />
      <Route path="/social-login" element={<SocialLogin />} />
    </Routes>
  );
};

export default Router;
