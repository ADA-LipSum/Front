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
    const { accessToken, uuid, adminId, customId, userRealname, userNickname, profileImage } = data;

    // 토큰을 스토어에 먼저 저장해야 인터셉터가 이후 요청에 사용할 수 있음
    set({ accessToken });
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    // role, isFirstLogin 등 추가 정보는 status 엔드포인트에서 가져옴
    const me = await axios.get('/api/auth/status');
    const meData = me.data.data ?? me.data;

    set({
      isLoggedIn: true,
      loading: false,
      user: {
        uuid: meData.uuid ?? uuid,
        adminId: meData.adminId ?? adminId,
        customId: meData.customId ?? customId,
        userRealname: meData.userRealname ?? userRealname,
        userNickname: meData.userNickname ?? userNickname,
        profileImage: meData.profileImage ?? profileImage,
        role: meData.role ?? '',
        isFirstLogin: meData.isFirstLogin ?? false,
      },
    });
  },

  checkLogin: async () => {
    const attempt = async () => {
      // reissue는 axios 요청 인터셉터가 자동으로 처리
      const me = await axios.get('/api/auth/status');
      const meData = me.data.data ?? me.data;

      set({
        isLoggedIn: true,
        loading: false,
        user: {
          uuid: meData.uuid,
          adminId: meData.adminId,
          customId: meData.customId,
          userRealname: meData.userRealname,
          userNickname: meData.userNickname,
          profileImage: meData.profileImage,
          role: meData.role ?? '',
          isFirstLogin: meData.isFirstLogin ?? false,
        },
      });
    };

    // 빠른 연속 새로고침 시 서버의 refresh token 교체 타이밍 문제로 실패할 수 있어 재시도
    const MAX_RETRIES = 3;
    for (let i = 0; i <= MAX_RETRIES; i++) {
      try {
        await attempt();
        return;
      } catch {
        if (i === MAX_RETRIES) break;
        await new Promise((r) => setTimeout(r, 700));
      }
    }

    delete axios.defaults.headers.common['Authorization'];
    set({ isLoggedIn: false, loading: false, user: null, accessToken: null });
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
