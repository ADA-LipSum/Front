import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from '@/api/axios';
import { login as loginApi } from '@/api/auth';
import { uploadProfileImage } from '@/features/auth/profileSlice';

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
  refreshToken: any;
  isLoggedIn: boolean;
  loading: boolean;
  user: User | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  loading: true,
  user: null,
  accessToken: null,
  refreshToken: null,
};

// 로그인 - localStorage 제거, 메모리에만 저장
export const login = createAsyncThunk(
  'api/auth/login',
  async ({ id, password }: { id: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await loginApi(id, password);
      const { accessToken } = res.data;

      // Refresh Token은 서버가 httpOnly 쿠키로 내려줘야 함 (프론트에서 건드리지 않음)
      // axios 헤더에 Access Token 설정
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      const me = await axios.get('/api/auth/status');

      return { user: me.data.data as User, accessToken };
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

// 새로고침 시 Silent Refresh - localStorage 대신 Refresh Token 쿠키로 재발급
export const checkLogin = createAsyncThunk(
  'api/auth/checkLogin',
  async (_, { rejectWithValue }) => {
    try {
      // httpOnly 쿠키의 Refresh Token이 자동 전송됨 (withCredentials)
      const refreshRes = await axios.post('/api/auth/reissue', {}, { withCredentials: true });
      const { accessToken } = refreshRes.data.data ?? refreshRes.data;

      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      const me = await axios.get('/api/auth/status');

      return { user: me.data.data as User, accessToken };
    } catch (err) {
      delete axios.defaults.headers.common['Authorization'];
      return rejectWithValue(null);
    }
  },
);

// 로그아웃 - 서버에 Refresh Token 무효화 요청
export const logoutAsync = createAsyncThunk('api/auth/logout', async () => {
  try {
    // 서버에서 httpOnly 쿠키 삭제 처리
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
  } finally {
    delete axios.defaults.headers.common['Authorization'];
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken?: string }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.accessToken}`;
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoggedIn = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken; // 메모리에만 저장
      })
      .addCase(checkLogin.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken; // 메모리에만 저장
      })
      .addCase(checkLogin.rejected, (state) => {
        state.isLoggedIn = false;
        state.loading = false;
        state.user = null;
        state.accessToken = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.accessToken = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        if (state.user) {
          state.user.profileImage = action.payload;
        }
      });
  },
});

export const { setAccessToken, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
