import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import type { RootState } from '@/store/store';
import { getProfile } from '@/api/profile';

const Intro = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [_intro, setIntro] = useState<string | null>(null); // _intro = TS에서 사용하지 않는 변수로 인식
  const { profile } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uuid) return;

      const res = await getProfile(user.uuid);

      // 핵심 부분
      setIntro(res.intro);
    };

    fetchProfile();
  }, [user]);

  return (
    <div className="text-center mt-5">
      {profile?.intro ? (
        <p className="text-gray-600">{profile.intro}</p>
      ) : (
        <p className="text-gray-600">소개가 없습니다.</p>
      )}
    </div>
  );
};

export default Intro;
