import axios from './axios';

export const getProfile = async (uuid: string) => {
  const response = await axios.get(`api/users/${uuid}`);
  return response.data.data;
};

export const getProjects = async (uuid: string) => {
  const response = await axios.get(`api/users/${uuid}/projects`);
  return response.data.data;
};

export const getUserByUsername = async (username: string) => {
  const response = await axios.get(`api/users/by-username/${username}`);
  return response.data.data;
};

export const getGuestbook = async (customId: string) => {
  const response = await axios.get(`api/users/${customId}/guestbook`);
  return response.data.data;
};

export const postGuestbook = async (customId: string, content: string) => {
  const response = await axios.post(`api/users/${customId}/guestbook`, { content });
  return response.data.data;
};

export const patchGuestbook = async (customId: string, content: string) => {
  const response = await axios.patch(`api/users/${customId}/guestbook`, { content });
  return response.data.data;
};

export const deleteGuestbook = async (customId: string) => {
  await axios.delete(`api/users/${customId}/guestbook`);
};
