import { Route, Routes } from 'react-router-dom';

import { lazy, Suspense, useEffect } from 'react';

import { useAuthStore } from '@/store/useAuthStore';
import MainLayout from '@/components/layout/MainLayout';

const Main = lazy(() => import('@/pages/Main/Main').then((m) => ({ default: m.Main })));
const Community = lazy(() => import('@/pages/Community/Community').then((m) => ({ default: m.Community })));
const CommunityLayout = lazy(() => import('@/pages/Community/CommunityLayout').then((m) => ({ default: m.CommunityLayout })));
const CommunityPostDetail = lazy(() => import('@/pages/Community/CommunityPostDetail').then((m) => ({ default: m.CommunityPostDetail })));
const CommunityWrite = lazy(() => import('@/pages/Community/CommunityWrite').then((m) => ({ default: m.CommunityWrite })));
const Exchange = lazy(() => import('@/pages/Exchange/Exchange').then((m) => ({ default: m.Exchange })));
const Event = lazy(() => import('@/pages/Event/Event').then((m) => ({ default: m.Event })));
const Contact = lazy(() => import('@/pages/Contact/Contact').then((m) => ({ default: m.Contact })));
const Login = lazy(() => import('@/pages/Auth/Login').then((m) => ({ default: m.Login })));
const SocialLogin = lazy(() => import('@/pages/Auth/SocialLogin').then((m) => ({ default: m.SocialLogin })));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const UserNotFound = lazy(() => import('./pages/NotFound/UserNotFound'));
const StudyGroup = lazy(() => import('@/pages/StudyGroup/StudyGroup').then((m) => ({ default: m.StudyGroup })));
const Announcement = lazy(() => import('@/pages/Announcement/Contact').then((m) => ({ default: m.Announcement })));

const Router = () => {
  const checkLogin = useAuthStore((state) => state.checkLogin);

  useEffect(() => {
    checkLogin(); // 새로고침 시 로그인 상태 확인
  }, [checkLogin]);

  return (
    <Suspense fallback={null}>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Main />} />
        <Route path="/community" element={<CommunityLayout />}>
          <Route index element={<Community />} />
          <Route path="write" element={<CommunityWrite />} />
          <Route path=":postId" element={<CommunityPostDetail />} />
        </Route>
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/event" element={<Event />} />
        <Route path="/study-group" element={<StudyGroup />} />
        <Route path="/announcement" element={<Announcement />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile/:customId" element={<Profile />} />
        <Route path="/not-found/user" element={<UserNotFound />} />
      </Route>

      {/* 로그인 페이지 */}
      <Route path="/login" element={<Login />} />
      <Route path="/social-login" element={<SocialLogin />} />
    </Routes>
    </Suspense>
  );
};

export default Router;
