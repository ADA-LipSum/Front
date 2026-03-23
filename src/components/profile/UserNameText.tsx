import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import type { RootState } from '@/store/store';
import { getProfile } from '@/api/profile';
import H2 from '../tags/H2';
const UserNameText = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uuid) return;

      const res = await getProfile(user.uuid);

      // 핵심 부분
      setUsername(res.username);
    };

    fetchProfile();
  }, [user]);
  return (
    <>
      <div className="text-lg font-bold text-center mt-5">
        <H2>{username || user?.nickname}</H2>
      </div>
    </>
  );
};

export default UserNameText;
