/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { getUserGitHubContributions } from '@/api/github';
import type { UserGithubContributions } from '@/types/github';

interface GithubState {
  contributions: UserGithubContributions | null;
  loading: boolean;
  error: string | null;
  fetchGithubContributions: (year: number) => Promise<void>;
}

export const useGithubStore = create<GithubState>((set) => ({
  contributions: null,
  loading: false,
  error: null,

  fetchGithubContributions: async (year) => {
    set({ loading: true, error: null });
    try {
      const data = await getUserGitHubContributions(year);
      set({ loading: false, contributions: data });
    } catch (err: any) {
      set({ loading: false, error: err.response?.data?.message || '깃허브 잔디 정보 조회 실패' });
    }
  },
}));
