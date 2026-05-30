import axios from './axios';

// 로그인 API
export const login = async (id: string, password: string, rememberMe: boolean) => {
  const response = await axios.post('/api/auth/login', {
    id,
    password,
    rememberMe,
  });

  return response.data;
};

// 인증 상태 조회
export const checkAuth = async () => {
  const response = await axios.get('api/auth/status');
  return response.data;
};
