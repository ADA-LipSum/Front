import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// 요청 인터셉터 - Zustand 메모리에서 토큰 읽기
instance.interceptors.request.use((config) => {
  if (config.url?.includes('/auth/reissue')) return config;

  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 - 401 시 토큰 재발급 후 메모리에 저장
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
        const res = await instance.post('/api/auth/reissue', {});
        const newAccessToken = res.data.data?.accessToken ?? res.data.accessToken;

        useAuthStore.getState().setAccessToken(newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return instance(originalRequest);
      } catch (err) {
        useAuthStore.getState().clearCredentials();
        delete instance.defaults.headers.common['Authorization'];
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
