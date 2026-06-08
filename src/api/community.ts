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
  sort?: 'LATEST' | 'POPULAR';
  mediaFilter?: 'ALL' | 'PHOTO' | 'VIDEO' | 'TEXT';
}

export interface getCommunityPostsDailyResponse {
  uuid: string;
}

export interface CommunityPostItem {
  postUuid: string;
  seq: number;
  postId: number;
  title: string;
  writer: string;
  writerProfileImage: string;
  writedAt: string;
  likes: number;
  views: number;
  comments: number;
  isDev: boolean;
  devTags: string;
  tag: string;
  techTags: string[];
  boardType: string;
  communityCategory: string;
  techSubTag: string;
  thumbnailImage: string | null;
  images: string[];
  videos: string[];
}

export interface CommunityPostsPage {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: CommunityPostItem[];
}

// 커뮤니티 활성화 배너 조회
export const getCommunityBanner = async () => {
  const res = await axios.get<ApiResponse<unknown>>('/api/community/banners');
  return res.data.data;
};

// 커뮤니티 게시글 목록 조회 및 검색
export const getCommunityPosts = async (params: getCommunityPostsParams) => {
  const res = await axios.get<ApiResponse<CommunityPostsPage>>('/api/community/posts', { params });
  return res.data.data;
};

export interface getDevCommunityPostsParams {
  page?: number;
  size?: number;
  postType?: 'ALL' | 'QUESTION' | 'PROJECT' | 'RESOURCE_SHARING';
  language?: string;
  query?: string;
  sort?: 'LATEST' | 'POPULAR';
}

// 개발 커뮤니티 게시글 목록 조회 및 검색
export const getDevCommunityPosts = async (params: getDevCommunityPostsParams) => {
  const res = await axios.get<ApiResponse<CommunityPostsPage>>('/api/community/dev/posts', {
    params,
  });
  return res.data.data;
};

export interface EmojiReaction {
  emoji: string;
  count: number;
  reacted: boolean;
}

export interface PostAttachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface PostPoll {
  id: number;
  postUuid: string;
  question: string;
  anonymous: boolean;
  endsAt: string;
  ended: boolean;
  totalVotes: number;
  myOptionId: number | null;
  options: {
    id: number;
    text: string;
    voteCount: number;
    voters: { voterUuid: string; voterName: string }[];
  }[];
}

export interface PostDetail {
  postUuid: string;
  seq: number | null;
  writerUuid: string;
  writerCustomId: string;
  writer: string;
  writerProfileImage: string;
  title: string;
  content: string;
  images: string | string[] | null;
  videos: string | string[] | null;
  thumbnailImage: string | null;
  writedAt: string;
  updatedAt: string;
  likes: number;
  views: number;
  comments: number;
  isDev: boolean;
  devTags: string;
  techTags: string[];
  boardType: string;
  communityCategory: string;
  techSubTag: string;
  isLiked: boolean;
  isBookmarked: boolean;
  emojiReactions: EmojiReaction[];
  attachments: PostAttachment[];
  poll: PostPoll | null;
}

// 커뮤니티 게시글 상세 조회
export const getCommunityPostDetail = async (postId: string): Promise<PostDetail> => {
  const res = await axios.get<ApiResponse<PostDetail>>(`/api/community/posts/${postId}`);
  return res.data.data;
};

export interface CreateGeneralPostRequest {
  title: string;
  content: string;
  communityCategory: 'CHAT' | 'MEME' | 'PROJECT_SHOWCASE';
  images?: string[];
  videos?: string[];
}

export interface CreateDevPostPollInput {
  question: string;
  options: string[];
  endsAt: string;
  anonymous: boolean;
}

export interface CreateDevPostRequest {
  title: string;
  content: string;
  techSubTag: 'QUESTION' | 'PROJECT' | 'RESOURCE_SHARING';
  techTags?: string[];
  images?: string[];
  poll?: CreateDevPostPollInput;
}

// 일반 커뮤니티 게시글 작성 (JSON)
export const createGeneralPost = async (data: CreateGeneralPostRequest): Promise<number> => {
  const res = await axios.post<ApiResponse<number>>('/api/community/posts', data);
  return res.data.data;
};

// 개발 커뮤니티 게시글 작성 (JSON)
export const createDevPost = async (data: CreateDevPostRequest): Promise<number> => {
  const res = await axios.post<ApiResponse<number>>('/api/community/dev/posts', data);
  return res.data.data;
};

// 커뮤니티 게시글 작성 (multipart)
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
