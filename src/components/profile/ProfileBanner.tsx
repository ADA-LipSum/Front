import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import type { RootState } from '@/store/store';
import { getProfile } from '@/api/profile';

const ProfileBanner = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uuid) return;

      const res = await getProfile(user.uuid);

      // 핵심 부분
      setBanner(res.data.profileBanner);
    };

    fetchProfile();
  }, [user]);

  return (
    <img
      className="w-full h-87.5 bg-gray-200 mb-4 object-cover border-b border-[#d1d0d0]"
      src={banner && banner !== '' ? banner : '../../assets/default banner.jpg'}
    />
  );
};

export default ProfileBanner;
