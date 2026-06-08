import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string | null;
}

interface PageResponse<T> {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: T[];
}

export interface BookmarkPost {
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
}

export const getBookmarks = async (page = 0, size = 20): Promise<PageResponse<BookmarkPost>> => {
  const res = await axios.get<ApiResponse<PageResponse<BookmarkPost>>>(
    '/api/community/posts/bookmarks',
    { params: { page, size } },
  );
  return res.data.data;
};
