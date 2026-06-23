import { useProfileStore } from '@/store/profileStore';
import Avatar from '@/components/global/Avatar';
import { Tooltip } from 'react-tooltip';

const ProfileImage = () => {
  const { profile, loading } = useProfileStore();

  if (loading) {
    return <div className="w-40 h-40 rounded-full bg-gray-300 animate-pulse" />;
  }

  return (
    <div
      className="w-40 h-40 rounded-full overflow-hidden bg-white"
      style={{
        border: `8px solid ${profile?.profileImageOutlineColor ?? '#3b82f6'}`,
        boxSizing: 'border-box',
      }}
      data-tooltip-id="userRealname-tooltip"
      data-tooltip-content={profile?.userRealname || '실명 정보가 없습니다.'}
    >
      <Avatar
        size="full"
        className="object-cover"
        src={profile?.profileImage ?? null}
        name={'Profile'}
      />
      <Tooltip id="userRealname-tooltip" place="top" className="text-xs z-50" />
    </div>
  );
};

export default ProfileImage;
