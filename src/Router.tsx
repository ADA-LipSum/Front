import { Route, Routes } from 'react-router-dom';

import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/store';

import { Main } from '@/pages/Main/Main';
import { Community } from '@/pages/Community/Community';
import { Exchange } from '@/pages/Exchange/Exchange';
import { Event } from '@/pages/Event/Event';
import { Contact } from '@/pages/Contact/Contact';
import { Login } from '@/pages/Auth/Login';
import { SocialLogin } from '@/pages/Auth/SocialLogin';
import MainLayout from '@/components/layout/MainLayout';
import { checkLogin } from './features/auth/authSlice';

const Router = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkLogin()); // 새로고침 시 로그인 상태 확인
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Main />} />
        <Route path="/community" element={<Community />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/event" element={<Event />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* 로그인 페이지 */}
      <Route path="/login" element={<Login />} />
      <Route path="/social-login" element={<SocialLogin />} />
    </Routes>
  );
};

export default Router;
