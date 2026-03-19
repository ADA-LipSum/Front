import axios from './axios';

export const getProfile = async (uuid: string) => {
  const response = await axios.get(`api/users/${uuid}`);
  return response.data.data;
};
