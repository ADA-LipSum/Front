import axios from 'axios';
import { setAccessToken, clearCredentials } from '@/features/auth/authSlice';
import { store } from '@/store/store';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// 요청 인터셉터 - localStorage 대신 Redux 메모리에서 토큰 읽기
instance.interceptors.request.use((config) => {
  if (config.url?.includes('/auth/reissue')) return config;

  const token = store.getState().auth.accessToken; // 메모리에서 읽기
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 - 재발급 후 메모리에 저장
instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/reissue')
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = store.getState().auth.refreshToken;
        const res = await instance.post('api/auth/reissue', { refreshToken });

        const newAccessToken = res.data.data.accessToken;
        const newRefreshToken = res.data.data.refreshToken;

        //  localStorage 대신 Redux에 저장
        store.dispatch(
          setAccessToken({ accessToken: newAccessToken, refreshToken: newRefreshToken }),
        );

        instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return instance(originalRequest);
      } catch (err) {
        store.dispatch(clearCredentials());
        delete instance.defaults.headers.common['Authorization'];
        window.location.href = '/login'; // 재발급 실패 시 로그인 페이지로
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
