import Intro from '@/components/profile/Intro';
import ProfileBanner from '@/components/profile/ProfileBanner';
import ProfileImage from '@/components/profile/ProfileImage';
import UserNameText from '@/components/profile/UserNameText';
import ProjectList from '@/components/profile/ProjectList';
import Guestbook from '@/components/profile/Guestbook';
import SocialLinks from '@/components/profile/SocialLinks';

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchProfileByUsername, clearProfile } from '@/features/auth/profileSlice';
import { ButtonGroup } from '@/components/profile/ButtonGroup';
import TechStack from '@/components/profile/TechStack';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { customId } = useParams<{ customId: string }>();
  const { profile, error, loading } = useSelector((state: RootState) => state.profile);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const isStudent = profile?.role === 'STUDENT';
  const isOwnProfile = authUser?.customId === customId;

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
      <div className="min-h-220">
        <ProfileBanner />
        {isOwnProfile && <ButtonGroup />}
        <div className="-mt-25 px-30 flex flex-col items-center">
          <ProfileImage />
          <UserNameText />
          <Intro />
          <SocialLinks />
          <TechStack />
          {/* {isStudent && <ContriGraph />} */}
          {isStudent && <ProjectList />}
          {isStudent && <Guestbook />}
        </div>
      </div>
    </>
  );
};

export default Profile;
