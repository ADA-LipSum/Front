import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type NoticeCategory = 'EVENT' | 'SERVICE' | 'EMPLOYMENT' | 'OTHER';

export interface NoticeItem {
  id: string;
  seq: number;
  title: string;
  authorName: string;
  authorProfileImage: string;
  createdAt: string;
  views: number;
  noticeCategory: NoticeCategory | null;
  isPinned: boolean | null;
  pinnedAt: string | null;
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

export interface NoticeAttachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface NoticeDetail {
  postUuid: string;
  seq: number;
  writer: string;
  writerProfileImage: string;
  title: string;
  content: string;
  writedAt: string;
  views: number;
  noticeCategory: NoticeCategory | null;
  isPinned: boolean | null;
  pinnedAt: string | null;
  attachments: NoticeAttachment[];
}

export const getNoticeDetail = async (seq: number): Promise<NoticeDetail> => {
  const res = await axios.get<ApiResponse<NoticeDetail>>(`/api/notices/${seq}`);
  return res.data.data;
};
