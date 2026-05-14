import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const AdminRoute = () => {
  const { isLoggedIn, loading, user } = useAuthStore();

  if (loading) return null;

  if (!isLoggedIn || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
