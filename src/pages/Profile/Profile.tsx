import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
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
  const isStudent = profile?.role === 'STUDENT';

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
      <div className="min-h-220 bg-[#f7f8fa]">
        <ProfileBanner />
        {/* 프로필 이미지 행: 배너와 -mt-25 겹침, 소셜 링크는 이 행 기준으로 absolute */}
        <div className="relative -mt-25 h-40 flex items-center justify-center">
          <ProfileImage />
          {isStudent && <SocialLinks />}
        </div>
        {/* 나머지 프로필 콘텐츠 */}
        <div className="flex flex-col items-center px-30">
          <UserNameText />
          <Intro />
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
