import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Pen } from 'lucide-react';

const ProfileBanner = () => {
  const { profile, loading } = useSelector((state: RootState) => state.profile);

  if (loading) {
    return <div className="w-full h-87.5 bg-gray-200 mb-4" />;
  }

  const banner = profile?.profileBanner;

  return (
    <>
      <div className="w-full h-87.5 mb-4 bg-gray-200 overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={banner}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      <div></div>
    </>
  );
};

export default ProfileBanner;
