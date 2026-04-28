import { Route, Routes } from 'react-router-dom';

import { useEffect } from 'react';

import { useAuthStore } from '@/store/authStore';

import { Main } from '@/pages/Main/Main';
import { Community } from '@/pages/Community/Community';
import { CommunityLayout } from '@/pages/Community/CommunityLayout';
import { CommunityPostDetail } from '@/pages/Community/CommunityPostDetail';
import { CommunityWrite } from '@/pages/Community/CommunityWrite';
import { Exchange } from '@/pages/Exchange/Exchange';
import { Contact } from '@/pages/Contact/Contact';
import { Login } from '@/pages/Auth/Login';
import { SocialLogin } from '@/pages/Auth/SocialLogin';
import MainLayout from '@/components/layout/MainLayout';
import Proifle from './pages/Profile/Profile';
import UserNotFound from './pages/NotFound/UserNotFound';
import { StudyGroup } from './pages/StudyGroup/StudyGroup';
import { Announcement } from './pages/Announcement/Contact';
import { Settings } from './pages/Setting/Settings';

const Router = () => {
  const checkLogin = useAuthStore((state) => state.checkLogin);

  useEffect(() => {
    checkLogin(); // 새로고침 시 로그인 상태 확인
  }, [checkLogin]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Main />} />
        <Route path="/community" element={<CommunityLayout />}>
          <Route index element={<Community />} />
          <Route path="write" element={<CommunityWrite />} />
          <Route path=":postId" element={<CommunityPostDetail />} />
        </Route>
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/study-group" element={<StudyGroup />} />
        <Route path="/announcement" element={<Announcement />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile/:customId" element={<Proifle />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/not-found/user" element={<UserNotFound />} />
      </Route>

      {/* 로그인 페이지 */}
      <Route path="/login" element={<Login />} />
      <Route path="/social-login" element={<SocialLogin />} />
    </Routes>
  );
};

export default Router;
