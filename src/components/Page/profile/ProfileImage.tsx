import { useProfileStore } from '@/store/profileStore';
import Avatar from '@/components/global/Avatar';

const ProfileImage = () => {
  const { profile, loading } = useProfileStore();

  if (loading) {
    return <div className="w-40 h-40 rounded-full bg-gray-300 animate-pulse" />;
  }

  return (
    <div className="w-40 h-40 rounded-full overflow-hidden bg-white outline-11 outline-[#ff8556]">
      <Avatar
        size="full"
        className="object-cover"
        src={profile?.profileImage ?? null}
        name={'Profile'}
      />
    </div>
  );
};

export default ProfileImage;
