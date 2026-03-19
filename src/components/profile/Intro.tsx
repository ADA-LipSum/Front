import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import type { RootState } from '@/store/store';
import { getProfile } from '@/api/profile';

const Intro = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [intro, setIntro] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uuid) return;

      const res = await getProfile(user.uuid);

      // 핵심 부분
      setIntro(res.data.intro);
    };

    fetchProfile();
  }, [user]);

  return (
    <div className="">
      <p className="text-gray-600">{user?.intro}</p>
    </div>
  );
};

export default Intro;
