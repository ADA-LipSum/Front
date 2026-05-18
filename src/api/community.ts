// 커뮤니티

import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string | null;
}

export interface getCommunityPostsParams {
  page?: number;
  size?: number;
  category?: 'ALL' | 'CHAT' | 'TECH' | 'MEME' | 'PROJECT_SHOWCASE';
  techSubTag?: 'QUESTION' | 'CHAT' | 'TIP' | 'POLL';
  techTag?: string;
  query?: string;
}

export interface getCommunityPostsDailyResponse {
  uuid: string;
}

// 커뮤니티 활성화 배너 조회
export const getCommunityBanner = async () => {
  const res = await axios.get<ApiResponse<unknown>>('/api/community/banners');
  return res.data.data;
};

// 커뮤니티 게시글 목록 조회 및 검색
export const getCommunityPosts = async (params: getCommunityPostsParams) => {
  const res = await axios.get<ApiResponse<unknown>>('/api/community/posts', {
    params,
  });
  return res.data.data;
};

// 커뮤니티 게시글 상세 조회
export const getCommunityPostDetail = async (postId: string) => {
  const res = await axios.get<ApiResponse<unknown>>(`/api/community/posts/${postId}`);
  return res.data.data;
};

// 커뮤니티 게시글 작성
export const createCommunityPost = async (formData: FormData) => {
  const res = await axios.post<ApiResponse<unknown>>('/api/community/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.data;
};

// 커뮤니티 게시글 좋아요 토글
export const toggleCommunityPostLike = async (postId: string) => {
  const res = await axios.post<ApiResponse<unknown>>(`/api/community/posts/${postId}/like`);
  return res.data.data;
};

// 커뮤니티 게시글 북마크 토글
export const toggleBookmark = async (postId: string) => {
  const res = await axios.post<ApiResponse<unknown>>(`/api/community/posts/${postId}/bookmark`);
  return res.data.data;
};
