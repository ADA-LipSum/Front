import { api } from '../../api/client';

export const fetchUserProfile = async (uuid: string) => {
  try {
    const response = await api.get(`/users/${uuid}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
