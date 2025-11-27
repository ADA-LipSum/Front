import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/auth/AuthContext';
import Design from './LoginRight';
import LoginLeft from './LoginLeft';

export default function Login() {
  const { user, authLoading } = useAuth();

  const hasCheckedInitial = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (!authLoading) {
      // 최초 진입 시 1번만 검사
      if (!hasCheckedInitial.current) {
        hasCheckedInitial.current = true;

        if (user) {
          alert('이미 로그인되어 있습니다.');
          navigate('/');
        }
      }
    }
  }, [authLoading, user, navigate]);

  if (authLoading) return null;

  if (user) return null;
  return (
    <div className="flex w-full h-screen">
      <LoginLeft />
      <Design />
    </div>
  );
}
