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
  pointsUuid: string;
  userUuid: string;
  changeType: string;
  points: number;
  balanceAfter: number;
  description?: string;
  refRuleId?: number | null;
  refEventUuid?: string | null;
  createdAt: string;
}

interface PointTransactionPageResponse {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: PointTransaction[];
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
    const response = await axios.get<ApiResponse<PointTransactionPageResponse>>(
      '/api/points/transactions',
      { params: { userUuid, page, size } },
    );
    if (response.data.success) {
      return response.data.data.content;
    }
    throw new Error(response.data.message || '포인트 거래내역 조회 실패');
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '포인트 거래내역 조회 실패');
  }
};
