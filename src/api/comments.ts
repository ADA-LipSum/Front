import axios from './axios';
import type { CommunityComment } from '@/types/community';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errorCode: string | null;
}

export interface CommentResponse {
  commentId: number;
  writerUuid: string;
  writer: string;
  writerProfileImage: string;
  content: string;
  createdAt: string;
  children: unknown[];
}

const mapToCommunityComment = (
  postUuid: string,
  comment: CommentResponse,
): CommunityComment => ({
  id: String(comment.commentId),
  postId: postUuid,
  author: comment.writer,
  authorId: comment.writerUuid,
  content: comment.content,
  createdAt: comment.createdAt,
  avatarSrc: comment.writerProfileImage,
});

export const fetchPostComments = async (
  postUuid: string,
): Promise<CommunityComment[]> => {
  const res = await axios.get<ApiResponse<CommentResponse[]>>(
    `/api/posts/${postUuid}/comments`,
  );
  return res.data.data.map((c) => mapToCommunityComment(postUuid, c));
};

export interface CreateCommentRequest {
  postUuid: string;
  content: string;
  parentId?: number | null;
}

// CommentCreateRequest 스키마는 Swagger에서 확인해야 합니다.
// 여기서는 postUuid, content, parentId(선택)를 사용하는 것으로 가정합니다.
export const createComment = async (
  payload: CreateCommentRequest,
): Promise<void> => {
  await axios.post<ApiResponse<unknown>>('/api/comments', payload);
};

