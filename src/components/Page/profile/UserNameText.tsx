import { useProfileStore } from '@/store/profileStore';

const UserNameText = () => {
  const { profile } = useProfileStore();

  return (
    <div className="text-center mt-7 w-full max-w-sm min-w-50">
      <h2 className="text-xl font-bold">{profile?.userNickname || profile?.userRealname}</h2>
    </div>
  );
};

export default UserNameText;
