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

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  loading: true,
  user: null,
  accessToken: null,

  login: async (id, password) => {
    const res = await loginApi(id, password);
    const { accessToken } = res.data;
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    const me = await axios.get('/api/auth/status');
    set({ isLoggedIn: true, loading: false, user: me.data.data as AuthUser, accessToken });
  },

  checkLogin: async () => {
    try {
      const refreshRes = await axios.post('/api/auth/reissue', {}, { withCredentials: true });
      const { accessToken } = refreshRes.data.data ?? refreshRes.data;
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const me = await axios.get('/api/auth/status');
      set({ isLoggedIn: true, loading: false, user: me.data.data as AuthUser, accessToken });
    } catch {
      delete axios.defaults.headers.common['Authorization'];
      set({ isLoggedIn: false, loading: false, user: null, accessToken: null });
    }
  },

  logout: async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } finally {
      delete axios.defaults.headers.common['Authorization'];
      set({ isLoggedIn: false, user: null, accessToken: null });
    }
  },

  setAccessToken: (accessToken) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    set({ accessToken });
  },

  clearCredentials: () => {
    set({ accessToken: null, isLoggedIn: false, user: null });
  },

  updateUserProfileImage: (imageUrl) => {
    set((state) => ({
      user: state.user ? { ...state.user, profileImage: imageUrl } : null,
    }));
  },
}));
