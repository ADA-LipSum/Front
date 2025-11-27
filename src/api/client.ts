import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://3.38.107.119:8080',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// 모든 요청에 Authorization 자동 추가
api.interceptors.request.use(config => {
  const tokenType = localStorage.getItem('token_type');
  const accessToken = localStorage.getItem('access_token');

  if (tokenType && accessToken) {
    config.headers.Authorization = `${tokenType} ${accessToken}`;
  }

  return config;
});
