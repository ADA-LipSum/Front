import Intro from '@/components/profile/Intro';
import ProfileBanner from '@/components/profile/ProfileBanner';
import ProfileImage from '@/components/profile/ProfileImage';
import UserNameText from '@/components/profile/UserNameText';
import ProjectList from '@/components/profile/ProjectList';
import Guestbook from '@/components/profile/Guestbook';
import SocialLinks from '@/components/profile/SocialLinks';

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { ButtonGroup } from '@/components/profile/ButtonGroup';
import TechStack from '@/components/profile/TechStack';

const Profile = () => {
  const navigate = useNavigate();
  const { customId } = useParams<{ customId: string }>();
  const { profile, error, loading, fetchProfileByUsername, clearProfile } = useProfileStore();
  const authUser = useAuthStore((state) => state.user);
  const isStudent = profile?.role === 'STUDENT';
  const isOwnProfile = authUser?.customId === customId;

  useEffect(() => {
    if (customId) {
      fetchProfileByUsername(customId);
    }
    return () => {
      clearProfile();
    };
  }, [customId, fetchProfileByUsername, clearProfile]);

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
