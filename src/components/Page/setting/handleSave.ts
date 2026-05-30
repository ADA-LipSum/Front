import { ShowErrorToast } from '@/components/Library/Toast/Toast';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';

export const handleSave = async () => {
  const user = useAuthStore((state) => state.user);
  const profile = useProfileStore((state) => state.profile);
  if (!user?.uuid || !profile?.uuid) {
    ShowErrorToast('사용자 정보를 찾을 수 없습니다.');
    return;
  }
};
