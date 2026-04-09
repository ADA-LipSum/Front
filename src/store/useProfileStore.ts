/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { getProfile, getUserByUsername } from '@/api/profile';
import type { Profile } from '@/types/profile';

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: (uuid: string) => Promise<void>;
  fetchProfileByUsername: (username: string) => Promise<void>;
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

  clearProfile: () => {
    set({ profile: null, loading: false, error: null });
  },
}));
