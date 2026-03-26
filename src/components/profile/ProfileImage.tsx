// import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

const ProfileImage = () => {
  const { profile, loading } = useSelector((state: RootState) => state.profile);

  if (loading) {
    return <div className="w-40 h-40 rounded-full bg-gray-200 animate-pulse" />;
  }

  return (
    <div className="w-40 h-40 rounded-full overflow-hidden bg-white outline-11 outline-[#F5F5F5]">
      <img
        className="w-full h-full object-cover"
        src={profile?.profileImage}
        alt="Profile"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
};

export default ProfileImage;
