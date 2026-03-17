import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

const ProfileBanner = () => {
  const { profile, loading } = useSelector((state: RootState) => state.profile);

  if (loading) {
    return <div className="w-full h-87.5 bg-gray-200 mb-4 border-b border-[#d1d0d0]" />;
  }

  const banner =
    profile?.profileBanner && profile.profileBanner !== ''
      ? profile.profileBanner
      : '../../../public/gray.jpg'; // TODO: public 폴더에 저장하기

  return (
    <img
      className="w-full h-87.5 object-cover mb-4 border-b border-[#d1d0d0]"
      src={banner}
      alt="profile banner"
    />
  );
};

export default ProfileBanner;
