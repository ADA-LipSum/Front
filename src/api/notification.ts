import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string | null;
}

interface PaginatedResponse<T> {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: T[];
}

export interface NotificationResponse {
  id: number;
  type?: string;
  title: string;
  message: string;
  postUuid: string;
  readAt: string | null;
  createdAt: string;
  senderUuid: string | null;
}

// 내 알림 목록 조회
export const getNotifications = async (): Promise<NotificationResponse[]> => {
  const res =
    await axios.get<ApiResponse<PaginatedResponse<NotificationResponse>>>('/api/notifications');
  return res.data.data.content;
};

// 특정 알림 읽음 처리
export const readNotification = async (id: number): Promise<void> => {
  await axios.put(`/api/notifications/${id}/read`);
};

// 알림 모두 읽음 처리
export const readAllNotifications = async (): Promise<void> => {
  await axios.put('/api/notifications/read-all');
};
