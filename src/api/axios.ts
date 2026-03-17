import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      // 로그인 및 재발급 요청은 재시도하지 않도록 조건 추가
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('api/auth/login') &&
      !originalRequest.url.includes('api/auth/reissue')
    ) {
      originalRequest._retry = true;

      try {
        const res = await instance.post('api/auth/reissue');
        const newAccessToken = res.data.data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);

        instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return instance(originalRequest);
      } catch (err) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        console.error('토큰 재발급 실패:', err);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
