/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { getProfile, getUserByUsername, editProfile, uploadProfileImage as uploadProfileImageApi } from '@/api/profile';
import { useAuthStore } from '@/store/useAuthStore';
import type { Profile } from '@/types/profile';

interface SocialLinks {
  githubUrl?: string;
  notionUrl?: string;
  linkedinUrl?: string;
  personalWebsiteUrl?: string;
}

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: (uuid: string) => Promise<void>;
  fetchProfileByUsername: (username: string) => Promise<void>;
  updateProfile: (params: { uuid: string; userNickname?: string; intro?: string; socialLinks?: SocialLinks }) => Promise<void>;
  uploadProfileImage: (params: { uuid: string; file: File }) => Promise<void>;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
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
    try {
      const result = await editProfile(uuid, {
        ...(userNickname ? { nickname: userNickname } : {}),
        ...(intro !== undefined ? { intro } : {}),
        ...(socialLinks ?? {}),
      });
      set((state) => ({
        profile: state.profile
          ? { ...state.profile, ...result, userNickname, intro, socialLinks: { ...state.profile.socialLinks, ...socialLinks } }
          : result,
      }));
    } catch (err: any) {
      throw err.response?.data?.message || '프로필 수정 실패';
    }
  },

  uploadProfileImage: async ({ uuid, file }) => {
    try {
      const url = await uploadProfileImageApi(uuid, file);
      set((state) => ({
        profile: state.profile ? { ...state.profile, profileImage: url } : null,
      }));
      useAuthStore.getState().setUserProfileImage(url);
    } catch (err: any) {
      throw err.response?.data?.message || '프로필 이미지 업로드 실패';
    }
  },

  clearProfile: () => {
    set({ profile: null, loading: false, error: null });
  },
}));
