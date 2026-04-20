import axios from 'axios';

// 동시 401 요청 race condition 방지
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  // 재발급 요청에는 만료된 accessToken을 Authorization 헤더에 포함하지 않음
  if (config.url?.includes('/auth/reissue')) {
    return config;
  }
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
      // 이미 재발급 중이면 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await instance.post(
          '/api/auth/reissue',
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

        processQueue(null, newAccessToken);

        return instance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        const hadSession = !!localStorage.getItem('refreshToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete instance.defaults.headers.common['Authorization'];
        // 세션이 있었는데 만료된 경우에만 리디렉션 (비로그인 상태에서의 무한 루프 방지)
        if (hadSession && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
