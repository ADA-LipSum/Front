import axios from './axios';
import type { CommunityPost } from '@/types/community';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errorCode: string | null;
}

interface PageResponse<T> {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: T[];
}

export interface PostSummaryResponse {
  postUuid: string;
  seq: number;
  title: string;
  writer: string;
  writerProfileImage: string;
  writedAt: string;
  likes: number;
  views: number;
  comments: number;
  isDev: boolean;
  devTags?: string | null;
  tag?: string | null;
}

export interface PostDetailResponse {
  postUuid: string;
  seq: number;
  writerUuid: string;
  writer: string;
  writerProfileImage: string;
  title: string;
  content: string;
  images?: string | null;
  videos?: string | null;
  writedAt: string;
  updatedAt: string;
  likes: number;
  views: number;
  comments: number;
  isDev: boolean;
  devTags?: string | null;
}

const parseTags = (devTags?: string | null, tag?: string | null): string[] => {
  const tags = new Set<string>();
  const addFromString = (value?: string | null) => {
    if (!value) return;
    value
      .split(/[,\s]+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((t) => tags.add(t));
  };

  addFromString(devTags);
  addFromString(tag);

  return Array.from(tags);
};

const mapToCommunityPost = (input: PostSummaryResponse | PostDetailResponse): CommunityPost => ({
  id: input.postUuid,
  title: input.title,
  content: 'content' in input ? input.content : '',
  author: 'writer' in input ? input.writer : '',
  authorId: 'writerUuid' in input ? input.writerUuid : undefined,
  createdAt: input.writedAt,
  tags: parseTags(input.devTags, 'tag' in input ? input.tag : undefined),
  status: 'recruiting',
  avatarSrc: input.writerProfileImage,
  likes: input.likes,
  views: input.views,
  commentsCount: input.comments,
  isDev: input.isDev,
  seq: input.seq,
});

export const fetchCommunityPosts = async (
  page = 0,
  size = 100,
): Promise<CommunityPost[]> => {
  const res = await axios.get<ApiResponse<PageResponse<PostSummaryResponse>>>(
    '/api/posts',
    {
      params: { page, size },
    },
  );

  return res.data.data.content.map(mapToCommunityPost);
};

export const fetchCommunityPostDetail = async (
  uuid: string,
): Promise<CommunityPost> => {
  const res = await axios.get<ApiResponse<PostDetailResponse>>(`/api/posts/${uuid}`);
  return mapToCommunityPost(res.data.data);
};

export interface CreateCommunityPostRequest {
  title: string;
  content: string;
  isDev: boolean;
  devTags?: string;
}

export const createCommunityPost = async (
  payload: CreateCommunityPostRequest,
): Promise<string> => {
  const res = await axios.post<ApiResponse<string>>('/api/posts', payload);
  return res.data.data;
};

export interface UpdateCommunityPostRequest {
  title?: string;
  content?: string;
  images?: string;
  videos?: string;
  isDev?: boolean;
  devTags?: string;
}

export const updateCommunityPost = async (
  uuid: string,
  payload: UpdateCommunityPostRequest,
): Promise<void> => {
  await axios.put<ApiResponse<unknown>>(`/api/posts/${uuid}`, payload);
};

export const deleteCommunityPost = async (uuid: string): Promise<void> => {
  await axios.delete<ApiResponse<unknown>>(`/api/posts/${uuid}`);
};

export const togglePostLike = async (uuid: string): Promise<boolean> => {
  const res = await axios.post<ApiResponse<boolean>>(`/api/posts/${uuid}/like`);
  return res.data.data;
};

