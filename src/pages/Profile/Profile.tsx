import Intro from '@/components/profile/Intro';
import ProfileBanner from '@/components/profile/ProfileBanner';
import ProfileImage from '@/components/profile/ProfileImage';
import UserNameText from '@/components/profile/UserNameText';
import ProjectList from '@/components/profile/ProjectList';
import Guestbook from '@/components/profile/Guestbook';
import SocialLinks from '@/components/profile/SocialLinks';

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchProfileByUsername, clearProfile, updateProfile } from '@/features/auth/profileSlice';
import { ButtonGroup } from '@/components/profile/ButtonGroup';
import TechStack from '@/components/profile/TechStack';
import { ShowErrorToast, ShowSuccessToast } from '@/components/Library/Toast/Toast';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { customId } = useParams<{ customId: string }>();
  const { profile, error, loading } = useSelector((state: RootState) => state.profile);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const isStudent = profile?.role === 'STUDENT';
  const isOwnProfile = authUser?.customId === customId;
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editIntro, setEditIntro] = useState('');

  // 편집 버튼 클릭 시 편집 모드로 전환
  const handleStartEdit = () => {
    setEditNickname(profile?.userNickname ?? '');
    setEditIntro(profile?.intro ?? '');
    setIsEditing(true);
  };

  // 저장 버튼 클릭 시 프로필 업데이트
  const handleSave = async () => {
    if (!profile?.uuid) return;
    if (editNickname.length > 10) return;
    try {
      await dispatch(
        updateProfile({ uuid: profile.uuid, userNickname: editNickname, intro: editIntro }),
      ).unwrap();
    } catch (err) {
      ShowErrorToast(err as string);
      return;
    }
    setIsEditing(false);
    ShowSuccessToast('프로필 업데이트 성공!');
  };

  // 취소 버튼 클릭 시 편집 모드 종료
  const handleCancel = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (customId) {
      dispatch(fetchProfileByUsername(customId));
    }
    return () => {
      dispatch(clearProfile());
    };
  }, [customId, dispatch]);

  useEffect(() => {
    if (!loading && error) {
      navigate('/not-found/user', { replace: true });
    }
  }, [loading, error, navigate]);

  return (
    <>
      <div className="min-h-220">
        <ProfileBanner />
        {isOwnProfile && (
          <ButtonGroup
            isEditing={isEditing}
            onEdit={handleStartEdit}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
        <div className="-mt-25 px-30 flex flex-col items-center">
          <ProfileImage isEditing={isEditing} isOwnProfile={isOwnProfile} />
          <UserNameText isEditing={isEditing} editValue={editNickname} onChange={setEditNickname} />
          <Intro isEditing={isEditing} editValue={editIntro} onChange={setEditIntro} />
          {isStudent && <SocialLinks />}
          {isStudent && <TechStack />}
          {/* {isStudent && <ContriGraph />} */}
          {isStudent && <ProjectList />}
          {isStudent && <Guestbook />}
        </div>
      </div>
    </>
  );
};

export default Profile;
