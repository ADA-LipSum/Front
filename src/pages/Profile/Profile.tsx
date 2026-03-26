import Intro from '@/components/profile/Intro';
import ProfileBanner from '@/components/profile/ProfileBanner';
import ProfileImage from '@/components/profile/ProfileImage';
import UserNameText from '@/components/profile/UserNameText';
import TechStack from '@/components/profile/TechStack';
import ContriGraph from '@/components/profile/ContriGraph';
import ProjectList from '@/components/profile/ProjectList';
import Guestbook from '@/components/profile/Guestbook';
import SocialLinks from '@/components/profile/SocialLinks';

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchProfileByUsername, clearProfile } from '@/features/auth/profileSlice';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { customId } = useParams<{ customId: string }>();
  const { error, loading } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    if (customId) {
      dispatch(fetchProfileByUsername(customId));
    }
    return () => {
      dispatch(clearProfile());
    };
  }, [customId, dispatch]);

  useEffect(() => {
    if (!loading && error) {
      navigate('/not-found/user', { replace: true });
    }
  }, [loading, error, navigate]);

  return (
    <>
      <div className="max-h-300">
        <ProfileBanner />
        <div className="-mt-25 px-30 flex flex-col items-center">
          <ProfileImage />
          <UserNameText />
          <Intro />
          <SocialLinks />
          <TechStack />
          <ContriGraph />
          <ProjectList />
          <Guestbook />
        </div>
      </div>
    </>
  );
};

export default Profile;
