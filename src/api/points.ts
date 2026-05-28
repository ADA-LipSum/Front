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
  totalPoints?: number;
}

export interface PointTransaction {
  pointsUUid: string;
  userUuid: string;
  changeType: string;
  points: number;
  balanceAfter: number;
  description?: string;
  refRuleId?: string;
  refEventUuid?: string;
  createdAt: string;
}

//  포인트 잔액 조회
export const fetchPointsBalance = async (userUuid: string): Promise<number> => {
  try {
    const response = await axios.get<ApiResponse<PointsBalanceResponse>>(
      `/api/points/balance/${userUuid}`,
    );
    if (response.data.success && response.data.data.totalPoints !== undefined) {
      return response.data.data.totalPoints;
    }
    throw new Error(response.data.message || '포인트 잔액 조회 실패');
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '포인트 잔액 조회 실패');
  }
};

// 포인트 거래내역 조회
export const fetchPointTransactions = async (
  userUuid: string,
  page?: number,
  size?: number,
): Promise<PointTransaction[]> => {
  try {
    const response = await axios.get<ApiResponse<PointTransaction[]>>('api/points/transactions', {
      params: { userUuid, page, size },
    });
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    throw new Error(response.data.message || '포인트 거래내역 조회 실패');
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '포인트 거래내역 조회 실패');
  }
};
