import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/api/axios';
import { login as loginApi } from '@/api/auth';

interface User {
  uuid: string;
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
}

const initialState: AuthState = {
  isLoggedIn: false,
  loading: true,
  user: null,
};

// 로그인
export const login = createAsyncThunk(
  'auth/login',
  async ({ id, password }: { id: string; password: string }) => {
    const res = await loginApi(id, password);

    const token = res.data.accessToken;

    // localStorage 저장
    localStorage.setItem('accessToken', token);

    // axios 기본 헤더 세팅
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // 사용자 정보 조회
    const me = await axios.get('/auth/me');

    return me.data.data;
  },
);

// 새로고침 시 로그인 유지
export const checkLogin = createAsyncThunk('auth/checkLogin', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('accessToken');

  if (!token) return rejectWithValue(null);

  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const res = await axios.get('/auth/me');
    return res.data.data;
  } catch (err) {
    localStorage.removeItem('accessToken');
    return rejectWithValue(null);
  }
});

// 로그아웃
export const logoutAsync = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('accessToken');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(checkLogin.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(checkLogin.rejected, (state) => {
        state.isLoggedIn = false;
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
