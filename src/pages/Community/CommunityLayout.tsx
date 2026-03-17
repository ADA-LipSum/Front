import { Outlet } from 'react-router-dom';
import { CommunityProvider } from '@/contexts/CommunityContext';

export const CommunityLayout = () => (
  <CommunityProvider>
    <Outlet />
  </CommunityProvider>
);
