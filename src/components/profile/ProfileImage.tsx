// import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

const ProfileImage = () => {
  const { profile, loading } = useSelector((state: RootState) => state.profile);

  if (loading) {
    return <div className="w-40 h-40 rounded-full bg-gray-200 animate-pulse" />;
  }

  return (
    <div className="w-40 h-40 rounded-full overflow-hidden bg-white outline-3 outline-blue-500">
      <img className="w-full h-full object-cover" src={profile?.profileImage} alt="Profile" />
      <h2 className="text-lg font-bold text-center mt-37.5">{profile?.userNickname}</h2>
    </div>
  );
};

export default ProfileImage;
