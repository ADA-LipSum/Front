import axios from './axios';

// 깃허브 연동 정보 조회
export const getUserGitHubInfo = async () => {
  const response = await axios.get(`api/auth/github/status`);
  return response.data.data;
};

// 깃허브 연동 시작
export const getGitHubOAuthUrl = async () => {
  const response = await axios.get(`api/auth/github/link`);
  return response.data.data;
};

// 깃허브 연동 해제
export const unlinkGitHub = async () => {
  await axios.delete(`api/auth/github/unlink`);
};

// 깃허브 로그인
export const getGitHubLogin = async () => {
  const response = await axios.get(`api/auth/github/login`);
  return response.data.data;
};

// 깃허브 잔디 조회 (로그인 유저)
export const getUserGitHubContributions = async (year: number) => {
  const response = await axios.get(`api/auth/github/contributions?year=${year}`);
  return response.data.data;
};

// 특정 유저 깃허브 잔디 조회
export const getProfileGitHubContributions = async (githubLogin: string) => {
  const response = await axios.get(`api/auth/github/contributions/${githubLogin}`);
  return response.data.data;
};
