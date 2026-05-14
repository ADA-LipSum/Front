// 커뮤니티 댓글

import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string | null;
}

export interface CommentData {
  commentId: string;
  writerUuid: string;
  writerCustomId?: string;
  writer: string;
  writerProfileImage: string;
  content: string;
  createdAt: string;
  children?: CommentData[];
}

// 커뮤니티 댓글 목록 조회
export const getCommunityComments = async (postSeq: string): Promise<CommentData[]> => {
  const res = await axios.get<ApiResponse<CommentData[]>>(
    `/api/comments/posts/${postSeq}/comments`,
  );
  return res.data.data;
};

// 커뮤니티 댓글 작성 (parentId 없으면 바디에 포함하지 않음)
export const postCommunityComments = async (
  postSeq: string,
  content: string,
  parentId?: string,
): Promise<CommentData> => {
  const body: { content: string; parentId?: string } = { content };
  if (parentId) body.parentId = parentId;
  console.log('[postCommunityComments] URL:', `/api/comments/posts/${postSeq}/comments`);
  console.log('[postCommunityComments] body:', JSON.stringify(body, null, 2));
  const res = await axios.post<ApiResponse<CommentData>>(
    `/api/comments/posts/${postSeq}/comments`,
    body,
  );
  return res.data.data;
};

// 커뮤니티 댓글 수정
export const updateCommunityComment = async (
  commentId: string,
  content: string,
): Promise<CommentData> => {
  const res = await axios.put<ApiResponse<CommentData>>(`/api/comments/${commentId}`, {
    content,
  });
  return res.data.data;
};

// 커뮤니티 댓글 삭제
export const deleteCommunityComment = async (commentId: string): Promise<void> => {
  await axios.delete(`/api/comments/${commentId}`);
};
