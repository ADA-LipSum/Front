import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
}

const initialState: AuthState = {
  isLoggedIn: false,
  loading: true,
  user: null,
};

// 로그인
export const login = createAsyncThunk(
  'api/auth/login',
  async ({ id, password }: { id: string; password: string }) => {
    const res = await loginApi(id, password);

    const token = res.data.accessToken;

    localStorage.setItem('accessToken', token); // TODO : 로컬 스토리지에 저장하는 방법 말고 다른 방법 찾기

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // axios 기본 헤더에 토큰 설정

    const me = await axios.get('/api/auth/status'); // 로그인 후 사용자 정보 가져오기

    return me.data.data as User;
  },
);

// 새로고침 시 로그인 유지
export const checkLogin = createAsyncThunk(
  'api/auth/checkLogin',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('accessToken');
    console.log('저장된 토큰:', token); // 디버깅용 토큰 출력

    // 토큰이 있으면 헤더에 설정, 없어도 요청 시도
    // (인터셉터가 401 발생 시 refresh token 쿠키로 재발급 처리)
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await axios.get('/api/auth/status');

      return res.data.data as User;
    } catch (err) {
      localStorage.removeItem('accessToken');
      console.log('로그인 상태 유지 실패:', err);
      delete axios.defaults.headers.common['Authorization'];
      return rejectWithValue(null);
    }
  },
);

// 로그아웃
export const logoutAsync = createAsyncThunk('api/auth/logout', async () => {
  localStorage.removeItem('accessToken');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        // 로그인 성공 시 상태 업데이트
        state.isLoggedIn = true;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(checkLogin.fulfilled, (state, action) => {
        // 로그인 상태 유지 성공 시 상태 업데이트
        state.isLoggedIn = true;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(checkLogin.rejected, (state) => {
        // 로그인 상태 유지 실패 시 상태 업데이트
        state.isLoggedIn = false;
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        // 로그아웃 성공 시 상태 업데이트
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
