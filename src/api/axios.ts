import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터에서 토큰을 자동으로 첨부하도록 설정
instance.interceptors.request.use((config) => {
  if (config.url?.includes('/auth/reissue')) return config; // 추가
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      // 로그인 및 재발급 요청은 재시도하지 않도록 조건 추가
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/reissue')
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await instance.post(
          'api/auth/reissue',
          refreshToken ? { refreshToken } : undefined,
        );
        const newAccessToken = res.data.data.accessToken;
        const newRefreshToken = res.data.data.refreshToken;

        localStorage.setItem('accessToken', newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return instance(originalRequest);
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete instance.defaults.headers.common['Authorization'];
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
