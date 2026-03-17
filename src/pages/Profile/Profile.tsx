// import Intro from '@/components/profile/Intro';
import ProfileBanner from '@/components/profile/ProfileBanner';
import ProfileImage from '@/components/profile/ProfileImage';
import UserNameText from '@/components/profile/UserNameText';

const Profile = () => {
  return (
    <>
      <ProfileBanner />
      <div className="-mt-25 px-30 flex flex-col">
        <div className="flex">
          <div>
            <ProfileImage />
            <UserNameText />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
