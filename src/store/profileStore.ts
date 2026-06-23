import { create } from 'zustand';
import {
  getProfile,
  getUserByUsername,
  editProfile,
  uploadProfileImage as uploadProfileImageApi,
} from '@/api/profile';
import type { Profile } from '@/types/profile';
import { useAuthStore } from './authStore';

interface ProfileStore {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: (uuid: string) => Promise<void>;
  fetchProfileByUsername: (username: string) => Promise<void>;
  updateProfile: (params: {
    uuid: string;
    userNickname?: string;
    intro?: string;
    profileImageOutlineColor?: string;
    socialLinks?: {
      githubUrl?: string;
      notionUrl?: string;
      linkedinUrl?: string;
      personalWebsiteUrl?: string;
    };
  }) => Promise<void>;
  uploadProfileImage: (uuid: string, file: File) => Promise<void>;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async (uuid) => {
    set({ loading: true, error: null });
    try {
      const data = await getProfile(uuid);
      set({ loading: false, profile: data });
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.message || '프로필 조회 실패' });
    }
  },

  fetchProfileByUsername: async (username) => {
    set({ loading: true, error: null });
    try {
      const data = await getUserByUsername(username);
      set({ loading: false, profile: data });
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.message || '프로필 조회 실패' });
    }
  },

  updateProfile: async ({ uuid, userNickname, intro, profileImageOutlineColor, socialLinks }) => {
    set({ loading: true, error: null });
    try {
      await editProfile(uuid, {
        ...(userNickname !== undefined ? { nickname: userNickname } : {}),
        ...(intro !== undefined ? { intro } : {}),
        ...(profileImageOutlineColor !== undefined ? { profileImageOutlineColor } : {}),
        ...(socialLinks ?? {}),
      });
      set((state) => ({
        loading: false,
        profile: state.profile
          ? {
              ...state.profile,
              ...(userNickname !== undefined ? { userNickname } : {}),
              ...(intro !== undefined ? { intro } : {}),
              ...(profileImageOutlineColor !== undefined ? { profileImageOutlineColor } : {}),
              ...(socialLinks !== undefined ? { socialLinks } : {}),
            }
          : state.profile,
      }));
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.message || '프로필 수정 실패' });
    }
  },

  uploadProfileImage: async (uuid, file) => {
    set({ loading: true, error: null });
    try {
      const imageUrl = await uploadProfileImageApi(uuid, file);
      set((state) => ({
        loading: false,
        profile: state.profile ? { ...state.profile, profileImage: imageUrl } : state.profile,
      }));
      useAuthStore.getState().updateUserProfileImage(imageUrl);
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.message || '이미지 업로드 실패' });
    }
  },

  clearProfile: () => {
    set({ profile: null, loading: false, error: null });
  },
}));
