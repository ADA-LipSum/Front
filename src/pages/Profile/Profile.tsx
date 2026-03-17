import Intro from '@/components/profile/Intro';
import ProfileBanner from '@/components/profile/ProfileBanner';
import ProfileImage from '@/components/profile/ProfileImage';
import UserNameText from '@/components/profile/UserNameText';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchProfile } from '@/features/auth/profileSlice';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?.uuid) {
      dispatch(fetchProfile(user.uuid));
    }
  }, [user, dispatch]);

  return (
    <>
      <ProfileBanner />
      <div className="-mt-25 px-30 flex flex-col">
        <div className="flex">
          <div>
            <ProfileImage />
            <UserNameText />
            <Intro />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
