import Intro from '@/components/profile/Intro';
import ProfileBanner from '@/components/profile/ProfileBanner';
import ProfileImage from '@/components/profile/ProfileImage';
import UserNameText from '@/components/profile/UserNameText';
import Guestbook from '@/components/profile/Guestbook';
import SocialLinks from '@/components/profile/SocialLinks';

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { ButtonGroup } from '@/components/profile/ButtonGroup';
import { ShowErrorToast, ShowSuccessToast } from '@/components/Library/Toast/Toast';
import ContriGraph from '@/components/profile/ContriGraph';

const Profile = () => {
  const navigate = useNavigate();
  const { customId } = useParams<{ customId: string }>();
  const { profile, error, loading, fetchProfileByUsername, clearProfile, updateProfile, uploadProfileImage } = useProfileStore();
  const authUser = useAuthStore((state) => state.user);
  const isStudent = profile?.role === 'STUDENT';
  const isOwnProfile = authUser?.customId === customId;
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editIntro, setEditIntro] = useState('');
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [editSocialLinks, setEditSocialLinks] = useState({
    githubUrl: '',
    notionUrl: '',
    linkedinUrl: '',
    personalWebsiteUrl: '',
  });

  // 편집 버튼 클릭 시 편집 모드로 전환
  const handleStartEdit = () => {
    setEditNickname(profile?.userNickname ?? '');
    setEditIntro(profile?.intro ?? '');
    setEditSocialLinks({
      githubUrl: profile?.socialLinks?.githubUrl ?? '',
      notionUrl: profile?.socialLinks?.notionUrl ?? '',
      linkedinUrl: profile?.socialLinks?.linkedinUrl ?? '',
      personalWebsiteUrl: profile?.socialLinks?.personalWebsiteUrl ?? '',
    });
    setIsEditing(true);
  };

  const handleImageSelect = (file: File) => {
    if (previewImageUrl) URL.revokeObjectURL(previewImageUrl);
    setPendingImageFile(file);
    setPreviewImageUrl(URL.createObjectURL(file));
  };

  // 저장 버튼 클릭 시 프로필 업데이트
  const handleSave = async () => {
    if (!profile?.uuid) return;
    if (editNickname.length > 10) return;
    const isValidUrl = (url: string) => {
      try {
        if (url) new URL(url);
        return true;
      } catch {
        return false;
      }
    };
    const hasInvalidUrl = Object.values(editSocialLinks).some((url) => !isValidUrl(url));
    if (hasInvalidUrl) {
      ShowErrorToast('올바른 URL 형식을 확인해주세요');
      return;
    }
    if (pendingImageFile) {
      try {
        await uploadProfileImage(profile.uuid, pendingImageFile);
      } catch (err) {
        ShowErrorToast(err as string);
        return;
      }
      if (previewImageUrl) URL.revokeObjectURL(previewImageUrl);
      setPendingImageFile(null);
      setPreviewImageUrl(null);
    }
    try {
      await updateProfile({
        uuid: profile.uuid,
        userNickname: editNickname,
        intro: editIntro,
        socialLinks: editSocialLinks,
      });
    } catch (err) {
      ShowErrorToast(err as string);
      return;
    }
    setIsEditing(false);
    ShowSuccessToast('프로필 업데이트 성공!');
  };

  // 취소 버튼 클릭 시 편집 모드 종료
  const handleCancel = () => {
    if (previewImageUrl) URL.revokeObjectURL(previewImageUrl);
    setPendingImageFile(null);
    setPreviewImageUrl(null);
    setIsEditing(false);
  };

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
        {isOwnProfile && (
          <ButtonGroup
            isEditing={isEditing}
            onEdit={handleStartEdit}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
        <div className="-mt-25 px-30 flex flex-col items-center">
          <ProfileImage
            isEditing={isEditing}
            isOwnProfile={isOwnProfile}
            previewUrl={previewImageUrl}
            onImageSelect={handleImageSelect}
          />
          <UserNameText isEditing={isEditing} editValue={editNickname} onChange={setEditNickname} />
          <Intro isEditing={isEditing} editValue={editIntro} onChange={setEditIntro} />
          {isStudent && (
            <SocialLinks
              isEditing={isEditing}
              editValues={editSocialLinks}
              onChange={(key, value) => setEditSocialLinks((prev) => ({ ...prev, [key]: value }))}
            />
          )}
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
