import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import H2 from '../tags/H2';
const UserNameText = () => {
  const { profile } = useSelector((state: RootState) => state.profile);

  return (
    <>
      <div className="text-center mt-5">
        <H2>{profile?.userNickname || profile?.userRealname}</H2>
        {/* {profile?.customId && <p className="text-sm text-gray-500 mt-1">@{profile.customId}</p>} */}
      </div>
    </>
  );
};

export default UserNameText;
