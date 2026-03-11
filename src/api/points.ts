import axios from './axios';

export const getPointBalance = async (userUuid: string) => {
  const res = await axios.get('/api/points/balance', {
    params: { userUuid },
  });

  return res.data.data.totalPoints;
};
