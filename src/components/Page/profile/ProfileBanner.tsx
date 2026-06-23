import { useProfileStore } from '@/store/profileStore';

const ProfileBanner = () => {
  const { profile, loading } = useProfileStore();

  if (loading) {
    return <div className="w-full aspect-4/1 bg-gray-200 mb-4" />;
  }

  const banner = profile?.profileBanner;

  return (
    <>
      <div className="w-full aspect-4/1 mb-4 bg-gray-200 overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={banner}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      <div></div>
    </>
  );
};

export default ProfileBanner;
