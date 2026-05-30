import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@/store/authStore';
import { LeftSection } from '@/components/Page/auth/Left/LeftSection';
import { RightSection } from '@/components/Page/auth/Right/RightSection';

export const Login = () => {
  const { isLoggedIn, loading } = useAuthStore();

  if (loading) return null;
  if (isLoggedIn) return <Navigate to="/" replace />;

  return (
    <div>
      <LeftSection />
      <RightSection />
    </div>
  );
};
