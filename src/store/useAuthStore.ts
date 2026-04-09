/* eslint-disable no-console */
import { create } from 'zustand';
import axios from '@/api/axios';
import { login as loginApi } from '@/api/auth';

interface User {
  uuid: string;
  adminId: string;
  customId: string;
  role: string;
  userRealname: string;
  userNickname: string;
  profileImage: string;
  isFirstLogin: boolean;
}

interface AuthState {
  isLoggedIn: boolean;
  loading: boolean;
  user: User | null;
  login: (id: string, password: string) => Promise<void>;
  checkLogin: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  loading: true,
  user: null,

  // 로그인
  login: async (id, password) => {
    const res = await loginApi(id, password);

    const token = res.data.accessToken;
    const refreshToken = res.data.refreshToken;

    localStorage.setItem('accessToken', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const me = await axios.get('/api/auth/status');
    const user = me.data.data as User;

    set({ isLoggedIn: true, loading: false, user });
  },

  // 새로고침 시 로그인 유지
  checkLogin: async () => {
    const token = localStorage.getItem('accessToken');
    console.log('저장된 토큰:', token);

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await axios.get('/api/auth/status');
      const user = res.data.data as User;
      set({ isLoggedIn: true, loading: false, user });
    } catch (err) {
      localStorage.removeItem('accessToken');
      console.log('로그인 상태 유지 실패:', err);
      delete axios.defaults.headers.common['Authorization'];
      set({ isLoggedIn: false, loading: false, user: null });
    }
  },

  // 로그아웃
  logout: async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ isLoggedIn: false, user: null });
  },
}));
