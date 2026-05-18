import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string | null;
}

// 포인트 잔액 조회 API 응답 타입
interface PointsBalanceResponse {
  userUuid?: string;
  balance?: number;
}

// 포인트 잔액 조회 함수
export const fetchMyPointBalance = async (userUuid?: string): Promise<number> => {
  if (!userUuid) return 0;
  const res = await axios.get<ApiResponse<PointsBalanceResponse>>(
    `/api/points/balance/${userUuid}`,
  );
  return res.data.data.balance ?? 0;
};
