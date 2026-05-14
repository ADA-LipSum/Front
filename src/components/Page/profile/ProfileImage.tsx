import { useRef } from 'react';
import { useProfileStore } from '@/store/profileStore';

import { Upload } from 'lucide-react';
import Avatar from '@/components/global/Avatar';

interface ProfileImageProps {
  isEditing?: boolean;
  isOwnProfile?: boolean;
  previewUrl?: string | null;
  onImageSelect?: (file: File) => void;
}

const ProfileImage = ({
  isEditing = false,
  isOwnProfile = false,
  previewUrl,
  onImageSelect,
}: ProfileImageProps) => {
  const { profile, loading } = useProfileStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onImageSelect?.(file);
    e.target.value = '';
  };

  if (loading) {
    return <div className="w-40 h-40 rounded-full bg-gray-300 animate-pulse" />;
  }

  const canUpload = isEditing && isOwnProfile;

  return (
    <div className="relative w-40 h-40">
      <div className="w-40 h-40 rounded-full overflow-hidden bg-white outline-11 outline-[#F5F5F5]">
        <Avatar
          size="full"
          className="object-cover"
          src={previewUrl ?? profile?.profileImage ?? ''}
          name={'Profile'}
        />
      </div>
      {canUpload && (
        <>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/55 transition-colors"
            aria-label="프로필 이미지 변경"
          >
            <Upload className="w-8 h-8 text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
};

export default ProfileImage;
