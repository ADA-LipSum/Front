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

  updateProfile: async ({ uuid, userNickname, intro, socialLinks }) => {
    const result = await editProfile(uuid, {
      ...(userNickname ? { nickname: userNickname } : {}),
      ...(intro !== undefined ? { intro } : {}),
      ...(socialLinks ?? {}),
    });
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, ...result, userNickname, intro, socialLinks }
        : state.profile,
    }));
  },

  uploadProfileImage: async (uuid, file) => {
    const imageUrl = await uploadProfileImageApi(uuid, file);
    set((state) => ({
      profile: state.profile ? { ...state.profile, profileImage: imageUrl } : state.profile,
    }));
    useAuthStore.getState().updateUserProfileImage(imageUrl);
  },

  clearProfile: () => {
    set({ profile: null, loading: false, error: null });
  },
}));
