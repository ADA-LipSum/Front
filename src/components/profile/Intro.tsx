import { useProfileStore } from '@/store/useProfileStore';

const Intro = () => {
  const { profile } = useProfileStore();

  return (
    <div className="text-center mt-5">
      {profile?.intro ? (
        <p className="text-gray-600">{profile.intro}</p>
      ) : (
        <p className="text-gray-600">소개가 없습니다.</p>
      )}
    </div>
  );
};

export default Intro;
