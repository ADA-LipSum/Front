import { create } from 'zustand';
import axios from '@/api/axios';
import { login as loginApi } from '@/api/auth';

export interface AuthUser {
  uuid: string;
  adminId: string;
  customId: string;
  role: string;
  userRealname: string;
  userNickname: string;
  profileImage: string;
  isFirstLogin: boolean;
}

interface AuthStore {
  isLoggedIn: boolean;
  loading: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  login: (id: string, password: string) => Promise<void>;
  checkLogin: () => Promise<void>;
  logout: () => Promise<void>;
  setAccessToken: (accessToken: string) => void;
  clearCredentials: () => void;
  updateUserProfileImage: (imageUrl: string) => void;
}

const REFRESH_TOKEN_KEY = 'refreshToken';

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  loading: true,
  user: null,
  accessToken: null,

  login: async (id, password) => {
    const res = await loginApi(id, password);
    const { accessToken, refreshToken } = res.data;
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    const me = await axios.get('/api/auth/status');
    set({ isLoggedIn: true, loading: false, user: me.data.data as AuthUser, accessToken });
  },

  checkLogin: async () => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!storedRefreshToken) {
      set({ isLoggedIn: false, loading: false, user: null, accessToken: null });
      return;
    }

    const attempt = async () => {
      const refreshRes = await axios.post('/api/auth/reissue', {
        refreshToken: storedRefreshToken,
      });
      const data = refreshRes.data.data ?? refreshRes.data;
      const { accessToken, refreshToken } = data;
      if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const me = await axios.get('/api/auth/status');
      set({ isLoggedIn: true, loading: false, user: me.data.data as AuthUser, accessToken });
    };

    try {
      await attempt();
    } catch {
      // 빠른 재시도: 직전 페이지가 reissue 요청을 보낸 직후 unload됐을 가능성
      await new Promise((r) => setTimeout(r, 800));
      try {
        await attempt();
      } catch {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        delete axios.defaults.headers.common['Authorization'];
        set({ isLoggedIn: false, loading: false, user: null, accessToken: null });
      }
    }
  },

  logout: async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } finally {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      delete axios.defaults.headers.common['Authorization'];
      set({ isLoggedIn: false, user: null, accessToken: null });
    }
  },

  setAccessToken: (accessToken) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    set({ accessToken });
  },

  clearCredentials: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    set({ accessToken: null, isLoggedIn: false, user: null });
  },

  updateUserProfileImage: (imageUrl) => {
    set((state) => ({
      user: state.user ? { ...state.user, profileImage: imageUrl } : null,
    }));
  },
}));
