// 커뮤니티

import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string | null;
}

export interface FetchCommunityPostsParams {
  page?: number;
  size?: number;
  category?: 'ALL' | 'CHAT' | 'TECH' | 'MEME' | 'PROJECT_SHOWCASE';
  techSubTag?: 'QUESTION' | 'CHAT' | 'TIP' | 'POLL';
  techTag?: string;
  query?: string;
}

export interface FetchCommunityPostsDailyResponse {
  uuid: string;
}

// 커뮤니티 게시글 목록 조회 및 검색
export const fetchCommunityPosts = async (params: FetchCommunityPostsParams) => {
  const res = await axios.get<ApiResponse<unknown>>('/api/community/posts', {
    params,
  });
  return res.data.data;
};

// 커뮤니티 게시글 상세 조회
export const fetchCommunityPostDetail = async (uuid: string) => {
  const res = await axios.get<ApiResponse<unknown>>(`/api/community/posts/${uuid}`);
  return res.data.data;
};

// 커뮤니티 게시글 좋아요 토글
export const toggleCommunityPostLike = async (uuid: string) => {
  const res = await axios.post<ApiResponse<unknown>>(`/api/posts/${uuid}/like`);
  return res.data.data;
};
