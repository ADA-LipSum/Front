import { Outlet } from 'react-router-dom';
import Header from './Header/Header';

const MainLayout = () => {
  return (
    <>
      <Header isLoggedIn={false} />
      <Outlet />
    </>
  );
};

export default MainLayout;
