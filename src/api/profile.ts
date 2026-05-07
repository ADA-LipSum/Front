import axios from './axios';

// 유저 프로필 조회
export const getProfile = async (uuid: string) => {
  const response = await axios.get(`api/users/${uuid}`);
  return response.data.data;
};

// 유저가 작성한 프로젝트 조회
export const getProjects = async (uuid: string) => {
  const response = await axios.get(`api/users/${uuid}/projects`);
  return response.data.data;
};

// 유저 닉네임으로 조회
export const getUserByUsername = async (username: string) => {
  const response = await axios.get(`api/users/by-username/${username}`);
  return response.data.data;
};

// 방명록 조회
export const getGuestbook = async (customId: string) => {
  const response = await axios.get(`api/users/${customId}/guestbook`);
  return response.data.data;
};

// 방명록 작성
export const postGuestbook = async (customId: string, content: string) => {
  const response = await axios.post(`api/users/${customId}/guestbook`, { content });
  return response.data.data;
};

// 방명록 수정
export const patchGuestbook = async (customId: string, content: string) => {
  const response = await axios.patch(`api/users/${customId}/guestbook`, { content });
  return response.data.data;
};

// 방명록 삭제
export const deleteGuestbook = async (customId: string) => {
  await axios.delete(`api/users/${customId}/guestbook`);
};

// 프로필 정보 수정
export const editProfile = async (
  uuid: string,
  data: {
    nickname?: string;
    intro?: string;
    techStack?: string[];
    githubUrl?: string;
    notionUrl?: string;
    linkedinUrl?: string;
    personalWebsiteUrl?: string;
  },
) => {
  const response = await axios.patch(`api/users/${uuid}/profile`, data);
  return response.data.data;
};

// 프로필 이미지 업로드
export const uploadProfileImage = async (uuid: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`api/upload/profile/${uuid}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};
