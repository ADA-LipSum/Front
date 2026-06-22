/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const log = {
  req: (method: string, url: string, hasToken: boolean) =>
    console.log(`[API] → ${method.toUpperCase()} ${url}${hasToken ? ' 🔑' : ' (no token)'}`),
  res: (status: number, url: string, data: unknown) =>
    console.log(`[API] ← ${status} ${url}`, data),
  err: (status: number | undefined, url: string, data: unknown) =>
    console.error(`[API] ✗ ${status ?? 'ERR'} ${url}`, data),
  info: (...args: unknown[]) => console.log('[API]', ...args),
};

// 동시에 여러 요청이 들어와도 reissue는 한 번만 수행
let refreshing: Promise<string | null> | null = null;

const reissueAccessToken = (): Promise<string | null> => {
  if (!refreshing) {
    log.info('토큰 재발급 시도...');
    refreshing = instance
      .post('/api/auth/reissue')
      .then((res) => {
        const data = res.data.data ?? res.data;
        const { accessToken } = data;
        useAuthStore.getState().setAccessToken(accessToken);
        log.info('토큰 재발급 성공');
        return accessToken as string;
      })
      .catch((e) => {
        log.err(e.response?.status, '/api/auth/reissue', '토큰 재발급 실패');
        return null;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
};

// 요청 인터셉터 - 토큰이 없으면 reissue를 먼저 수행한 뒤 헤더에 주입
instance.interceptors.request.use(async (config) => {
  // axios 1.x transformRequest converts FormData to JSON when Content-Type is application/json.
  // Delete the header here (before transformRequest runs) so FormData is sent as multipart.
  if (config.data instanceof FormData) {
    config.headers.delete('Content-Type');
  }

  if (config.url?.includes('/auth/reissue') || config.url?.includes('/auth/login') || config.url?.includes('/auth/logout')) {
    log.req(config.method ?? 'get', config.url ?? '', false);
    return config;
  }

  let token = useAuthStore.getState().accessToken;
  if (!token) {
    log.info(`토큰 없음 — reissue 선행 (${config.url})`);
    token = await reissueAccessToken();
    // reissue 실패 시 응답 인터셉터가 중복 시도하지 않도록 표시
    if (!token) {
      (config as any)._reissueFailed = true;
    }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  log.req(config.method ?? 'get', config.url ?? '', !!token);
  return config;
});

// 응답 인터셉터 - 세션 중간에 토큰이 만료된 경우 401 시 재발급 후 재시도
instance.interceptors.response.use(
  (res) => {
    log.res(res.status, res.config.url ?? '', res.data);
    return res;
  },
  async (error) => {
    const originalRequest = error.config;
    log.err(error.response?.status, originalRequest?.url ?? '', error.response?.data);

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest._reissueFailed &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/reissue')
    ) {
      originalRequest._retry = true;

      // 리다이렉트 여부 판단: 기존에 토큰이 있었으면 세션 만료로 간주
      const wasLoggedIn = !!useAuthStore.getState().accessToken;
      log.info(`401 수신 — 토큰 재발급 후 재시도 (wasLoggedIn=${wasLoggedIn})`);

      try {
        const newToken = await reissueAccessToken();
        if (!newToken) throw new Error('reissue failed');

        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        log.info('재시도 요청:', originalRequest.url);
        return instance(originalRequest);
      } catch (err) {
        log.info('재발급 실패 — 로그인 페이지로 이동');
        useAuthStore.getState().clearCredentials();
        if (wasLoggedIn) {
          window.location.href = '/login';
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
