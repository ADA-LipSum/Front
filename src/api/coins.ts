import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string | null;
}

interface CoinsBalanceResponse {
  userUuid?: string;
  totalCoins?: number;
}

/** 본인 또는 ADMIN이 특정 사용자 코인 잔액 조회 — GET /api/coins/balance?userUuid= */
export const fetchMyCoinBalance = async (userUuid?: string): Promise<number> => {
  if (!userUuid) return 0;
  const res = await axios.get<ApiResponse<CoinsBalanceResponse>>('/api/coins/balance', {
    params: { userUuid },
  });
  return res.data.data.totalCoins ?? 0;
};
