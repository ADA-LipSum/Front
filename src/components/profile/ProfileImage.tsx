// import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

import gray from '@/assets/gray.jpg';

const ProfileImage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="w-40 h-40 rounded-full overflow-hidden bg-white outline-3 outline-blue-500">
      <img className="w-full h-full object-cover" src={user?.profileImage || gray} alt="Profile" />
      <h2 className="text-lg font-bold text-center mt-37.5">{user?.nickname}</h2>
    </div>
  );
};

export default ProfileImage;
