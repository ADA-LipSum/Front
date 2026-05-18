import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { ShowErrorToast, ShowSuccessToast } from '@/components/Library/Toast/Toast';
import Avatar from '@/components/global/Avatar';
import { Globe, Upload } from 'lucide-react';

import GitHub from '@/assets/GitHub.png';
import Linkedin from '@/assets/Linkedin.png';
import Notion from '@/assets/Notion.png';

export const ProfileSettings = () => {
  const user = useAuthStore((state) => state.user);
  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const uploadProfileImage = useProfileStore((state) => state.uploadProfileImage);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editNickname, setEditNickname] = useState('');
  const [editIntro, setEditIntro] = useState('');
  const [editSocialLinks, setEditSocialLinks] = useState({
    githubUrl: '',
    notionUrl: '',
    linkedinUrl: '',
    personalWebsiteUrl: '',
  });
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditNickname(profile.userNickname ?? '');
      setEditIntro(profile.intro ?? '');
      setEditSocialLinks({
        githubUrl: profile.socialLinks?.githubUrl ?? '',
        notionUrl: profile.socialLinks?.notionUrl ?? '',
        linkedinUrl: profile.socialLinks?.linkedinUrl ?? '',
        personalWebsiteUrl: profile.socialLinks?.personalWebsiteUrl ?? '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user?.uuid) {
      void fetchProfile(user.uuid);
    }
  }, [fetchProfile, user?.uuid]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingImageFile(file);
    setPreviewImageUrl(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!user?.uuid || !profile?.uuid) {
      ShowErrorToast('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    setIsSaving(true);
    try {
      if (pendingImageFile) {
        await uploadProfileImage(profile.uuid, pendingImageFile);
        if (previewImageUrl) URL.revokeObjectURL(previewImageUrl);
        setPendingImageFile(null);
        setPreviewImageUrl(null);
      }

      await updateProfile({
        uuid: profile.uuid,
        userNickname: editNickname,
        intro: editIntro,
        socialLinks: editSocialLinks,
      });

      ShowSuccessToast('프로필 수정 성공!');
    } catch (err) {
      ShowErrorToast(err instanceof Error ? err.message : '프로필 업데이트 실패');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex gap-20">
      {/* 왼쪽 폼 */}
      <div className="flex-1 max-w-175">
        <h1 className="text-xl font-bold mb-10 text-gray-800">프로필 정보</h1>
        <div className="space-y-8">
          {/* 배너 이미지 */}
          <div className="relative">
            <div className="w-full h-32 bg-gray-200 rounded-xl flex items-center justify-center">
              <img
                src={profile?.profileBanner}
                alt="배너 이미지"
                className="object-cover w-full h-full rounded-xl"
              />
            </div>
          </div>

          {/* 아이디 */}
          <div>
            <label className="block mb-3 font-medium">아이디</label>

            <input
              type="text"
              className="
                w-full
                h-14
                px-5
                rounded-xl
                border border-gray-300
                outline-none
                focus:border-blue-500
                focus:ring-1 focus:ring-blue-500
                text-gray-500
              "
              value={user?.customId}
              readOnly
            />
          </div>

          {/* 이름 */}
          <div>
            <label className="block mb-3 font-medium">이름</label>

            <input
              type="text"
              className="
                w-full
                h-14
                px-5
                rounded-xl
                border border-gray-300
                outline-none
                focus:border-blue-500
                focus:ring-1 focus:ring-blue-500
                text-gray-500
              "
              value={user?.userRealname}
              readOnly
            />
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block mb-3 font-medium">닉네임</label>

            <input
              type="text"
              className="
                w-full
                h-14
                px-5
                rounded-xl
                border border-gray-300
                outline-none
                focus:border-blue-500
                focus:ring-1 focus:ring-blue-500
              "
              value={editNickname}
              onChange={(e) => setEditNickname(e.target.value)}
              maxLength={10}
            />
            <div className="text-right text-sm text-gray-500 mt-1">{editNickname.length}/10</div>
          </div>

          {/* 자기소개 */}
          <div>
            <label className="block mb-3 font-medium">소개</label>

            <textarea
              className="
                w-full
                h-45
                p-5
                rounded-xl
                border border-gray-300
                outline-none
                focus:border-blue-500
                focus:ring-1 focus:ring-blue-500
                resize-none
              "
              placeholder="나를 소개해주세요."
              value={editIntro}
              onChange={(e) => setEditIntro(e.target.value)}
              maxLength={255}
            />
            <div className="text-right text-sm text-gray-500 mt-1">{editIntro.length}/255</div>
          </div>

          {/* 소셜 링크 */}
          <div>
            <label className="block mb-3 font-medium">소셜 링크</label>
            <div className="space-y-4">
              {/* 깃허브 */}
              <div className="flex items-center gap-3">
                <img src={GitHub} width={22} height={22} alt="GitHub" className="shrink-0" />
                <input
                  type="text"
                  className="
                    flex-1
                    h-14
                    px-5
                    rounded-xl
                    border border-gray-300
                    outline-none
                    focus:border-blue-500
                    focus:ring-1 focus:ring-blue-500
                  "
                  placeholder="https://github.com/username"
                  value={editSocialLinks.githubUrl}
                  maxLength={500}
                  onChange={(e) =>
                    setEditSocialLinks((prev) => ({ ...prev, githubUrl: e.target.value }))
                  }
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {editSocialLinks.githubUrl.length}/500
                </div>
              </div>

              {/* 노션 */}
              <div className="flex items-center gap-3">
                <img src={Notion} width={22} height={22} alt="Notion" className="shrink-0" />
                <input
                  type="text"
                  className="
                    flex-1
                    h-14
                    px-5
                    rounded-xl
                    border border-gray-300
                    outline-none
                    focus:border-blue-500
                    focus:ring-1 focus:ring-blue-500
                  "
                  placeholder="https://www.notion.so/username"
                  value={editSocialLinks.notionUrl}
                  maxLength={500}
                  onChange={(e) =>
                    setEditSocialLinks((prev) => ({ ...prev, notionUrl: e.target.value }))
                  }
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {editSocialLinks.notionUrl.length}/500
                </div>
              </div>

              {/* 링크드인 */}
              <div className="flex items-center gap-3">
                <img src={Linkedin} width={22} height={22} alt="LinkedIn" className="shrink-0" />
                <input
                  type="text"
                  className="
                    flex-1
                    h-14
                    px-5
                    rounded-xl
                    border border-gray-300
                    outline-none
                    focus:border-blue-500
                    focus:ring-1 focus:ring-blue-500
                  "
                  placeholder="https://www.linkedin.com/in/username"
                  value={editSocialLinks.linkedinUrl}
                  maxLength={500}
                  onChange={(e) =>
                    setEditSocialLinks((prev) => ({ ...prev, linkedinUrl: e.target.value }))
                  }
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {editSocialLinks.linkedinUrl.length}/500
                </div>
              </div>

              {/* 개인 웹사이트 */}
              <div className="flex items-center gap-3">
                <Globe size={22} className="shrink-0 text-gray-600" />
                <input
                  type="text"
                  className="
                    flex-1
                    h-14
                    px-5
                    rounded-xl
                    border border-gray-300
                    outline-none
                    focus:border-blue-500
                    focus:ring-1 focus:ring-blue-500
                  "
                  placeholder="https://www.mywebsite.com"
                  value={editSocialLinks.personalWebsiteUrl}
                  maxLength={500}
                  onChange={(e) =>
                    setEditSocialLinks((prev) => ({
                      ...prev,
                      personalWebsiteUrl: e.target.value,
                    }))
                  }
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {editSocialLinks.personalWebsiteUrl.length}/500
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-500 text-white py-2 px-4 w-full rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>

      {/* 프로필 이미지 */}
      <div className="w-55 flex justify-center">
        <div
          className="relative w-45 h-45 rounded-full overflow-hidden bg-gray-200 cursor-pointer"
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <Avatar
            src={previewImageUrl ?? profile?.profileImage ?? user?.profileImage ?? undefined}
            className="object-cover"
            size="full"
            name={'프로필 이미지'}
          />
          {isImageHovered && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors">
              <Upload className="w-8 h-8 text-white" />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange} // TODO: 파일 업로드 후 crop 기능을 통해 원하는 이미지를 프로필로 할 수 있게 추가하기
          />
        </div>
      </div>
    </div>
  );
};
