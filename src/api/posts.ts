// 커뮤니티

import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string | null;
}

// 게시글 목록 조회
export const fetchPosts = async (page: number, size: number) => {
  const res = await axios.get<ApiResponse<any>>('/api/posts', {
    params: { page, size },
  });
  return res.data.data;
};

// 게시글 상세 조회
export const fetchPostDetail = async (uuid: string) => {
  const res = await axios.get<ApiResponse<any>>(`/api/posts/${uuid}`);
  return res.data.data;
};

// 게시물 생성
export const createPost = async (
  title: string,
  content: string,
  isDev: boolean,
  devTags: string[],
) => {
  const res = await axios.post<ApiResponse<any>>('/api/posts', {
    title,
    content,
    isDev,
    devTags,
  });
  return res.data.data;
};

// 게시물 수정
export const updatePost = async (
  uuid: string,
  title: string,
  content: string,
  isDev: boolean,
  devTags: string[],
) => {
  const res = await axios.put<ApiResponse<any>>(`/api/posts/${uuid}`, {
    title,
    content,
    isDev,
    devTags,
  });
  return res.data.data;
};

// 게시물 삭제
export const deletePost = async (uuid: string) => {
  const res = await axios.delete<ApiResponse<any>>(`/api/posts/${uuid}`);
  return res.data.data;
};

// 게시물 좋아요 토글
export const toggleLikePost = async (uuid: string) => {
  const res = await axios.post<ApiResponse<any>>(`/api/posts/${uuid}/like`);
  return res.data.data;
};

// 게시물 좋아요 삭제
export const deleteLikePost = async (id: string) => {
  const res = await axios.delete<ApiResponse<any>>(`/api/posts/like/${id}`);
  return res.data.data;
};

// 게시물 댓글 조회
export const fetchComments = async (uuid: string) => {
  const res = await axios.get<ApiResponse<any>>(`/api/posts/${uuid}/comments`);
  return res.data.data;
};
