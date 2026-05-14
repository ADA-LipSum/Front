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

    const data = res.data.data ?? res.data;
    const { accessToken } = data;

    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    const me = await axios.get('/api/auth/status');

    set({
      isLoggedIn: true,
      loading: false,
      user: me.data.data as AuthUser,
      accessToken,
    });
  },

  checkLogin: async () => {
    const attempt = async () => {
      const refreshRes = await axios.post('/api/auth/reissue');

      const data = refreshRes.data.data ?? refreshRes.data;
      const { accessToken } = data;

      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      const me = await axios.get('/api/auth/status');

      set({
        isLoggedIn: true,
        loading: false,
        user: me.data.data as AuthUser,
        accessToken,
      });
    };

    try {
      await attempt();
    } catch {
      try {
        // 직전 reissue 직후 새로고침 대응
        await new Promise((r) => setTimeout(r, 800));

        await attempt();
      } catch {
        delete axios.defaults.headers.common['Authorization'];

        set({
          isLoggedIn: false,
          loading: false,
          user: null,
          accessToken: null,
        });
      }
    }
  },

  logout: async () => {
    try {
      await axios.post('/api/auth/logout');
    } finally {
      delete axios.defaults.headers.common['Authorization'];

      set({
        isLoggedIn: false,
        user: null,
        accessToken: null,
      });
    }
  },

  setAccessToken: (accessToken) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    set({ accessToken });
  },

  clearCredentials: () => {
    delete axios.defaults.headers.common['Authorization'];

    set({
      accessToken: null,
      isLoggedIn: false,
      user: null,
    });
  },

  updateUserProfileImage: (imageUrl) => {
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            profileImage: imageUrl,
          }
        : null,
    }));
  },
}));
