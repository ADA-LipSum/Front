import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type NoticeCategory = 'EVENT' | 'SERVICE' | 'EMPLOYMENT' | 'OTHER';

export interface NoticeItem {
  seq: number;
  title: string;
  writedAt: string;
  views: number;
  tag: NoticeCategory | null;
  tagLabel: string | null;
  isPinned: boolean;
  authorName?: string;
  authorProfileImage?: string;
}

export interface NoticesPage {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: NoticeItem[];
}

export interface GetNoticesParams {
  page?: number;
  size?: number;
  category?: NoticeCategory;
  query?: string;
}

export const getNotices = async (params: GetNoticesParams = {}): Promise<NoticesPage> => {
  const res = await axios.get<ApiResponse<NoticesPage>>('/api/notices', { params });
  return res.data.data;
};

export interface NoticeDetail {
  seq: number;
  tag: NoticeCategory | null;
  tagLabel: string | null;
  title: string;
  writer: string;
  writedAt: string;
  views: number;
  content: string;
  isPinned: boolean | null;
  attachments: string[];
}

export const getNoticeDetail = async (seq: number): Promise<NoticeDetail> => {
  const res = await axios.get<ApiResponse<NoticeDetail>>(`/api/notices/${seq}`);
  return res.data.data;
};
