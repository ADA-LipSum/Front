import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { ButtonGroup } from '@/components/Page/profile/ButtonGroup';
import ContriGraph from '@/components/Page/profile/ContriGraph';
import Guestbook from '@/components/Page/profile/Guestbook';
import Intro from '@/components/Page/profile/Intro';
import ProfileBanner from '@/components/Page/profile/ProfileBanner';
import ProfileImage from '@/components/Page/profile/ProfileImage';
import SocialLinks from '@/components/Page/profile/SocialLinks';
import UserNameText from '@/components/Page/profile/UserNameText';

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
  }, [customId]);

  useEffect(() => {
    if (!loading && error) {
      navigate('/not-found/user', { replace: true });
    }
  }, [loading, error, navigate]);

  return (
    <>
      <div className="min-h-220">
        <ProfileBanner />
        <div className="-mt-25 px-30 flex flex-col items-center">
          <ProfileImage />
          <UserNameText />
          <Intro />
          {isStudent && <SocialLinks />}
          {isStudent && profile?.githubAccount && (
            <ContriGraph githubLogin={profile.githubAccount} />
          )}
          {isStudent && <Guestbook />}
        </div>
      </div>
    </>
  );
};

export default Profile;
