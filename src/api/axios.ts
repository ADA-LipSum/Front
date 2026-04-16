import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/reissue')
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // 이미 갱신 중이면 큐에 등록하고 대기
      return new Promise((resolve) => {
        pendingQueue.push((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          resolve(instance(originalRequest));
        });
      });
    }

    isRefreshing = true;
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const res = await instance.post('api/auth/reissue', refreshToken ? { refreshToken } : undefined);
      const newAccessToken = res.data.data.accessToken;
      const newRefreshToken = res.data.data.refreshToken;

      localStorage.setItem('accessToken', newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      pendingQueue.forEach((cb) => cb(newAccessToken));
      pendingQueue = [];

      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return instance(originalRequest);
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete instance.defaults.headers.common['Authorization'];
      pendingQueue = [];
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default instance;
