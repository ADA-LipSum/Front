import axios from './axios';

export const login = async (id: string, password: string) => {
  const response = await axios.post('/auth/login', {
    id,
    password,
  });

  return response.data;
};
