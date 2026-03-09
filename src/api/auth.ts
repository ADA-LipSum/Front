import axios from './axios';

export const login = async (id: string, password: string) => {
  const response = await axios.post('api/auth/login', {
    id,
    password,
  });

  return response.data;
};
