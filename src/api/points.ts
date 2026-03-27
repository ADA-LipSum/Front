import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string | null;
}

interface PointsBalanceResponse {
  userUuid?: string;
  balance?: number;
}

export const fetchMyPointBalance = async (userUuid?: string): Promise<number> => {
  if (!userUuid) return 0;
  const res = await axios.get<ApiResponse<PointsBalanceResponse>>(
    `/api/points/balance/${userUuid}`,
  );
  return res.data.data.balance ?? 0;
};
