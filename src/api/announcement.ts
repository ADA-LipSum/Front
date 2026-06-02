import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string | null;
}

// 공지사항 목록 조회 파라미터
export interface AnnouncementListParams {
  page: number;
  size: number;
}

// 공지사항 목록 조회
interface AnnouncementListResponse {
  id: string;
  title: string;
  authorName: string;
  authorProfileImage: string;
  createdAt: string;
}

// 공지사항 상세 조회 파라미터
export interface AnnouncementDetailParams {
  id: string; // 1같은 숫자가 들어가야함
}

// 공지사항 상세 조회
interface AnnouncementDetailResponse {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorProfileImage: string;
  createdAt: string;
}
