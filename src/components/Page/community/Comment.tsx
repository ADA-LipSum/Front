import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { CornerDownRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { markdownComponents } from '@/components/Library/React-Markdown-Syntax/MarkdownComponents';
import { ShowWarningToast } from '@/components/Library/Toast/Toast';

import Avatar from '@/components/global/Avatar';

import {
  getCommunityComments,
  postCommunityComments,
  updateCommunityComment,
  deleteCommunityComment,
} from '@/api/comment';
import type { CommentData } from '@/api/comment';

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}초전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간전`;
  return `${Math.floor(diff / 86400)}일전`;
}

interface Props {
  postId?: string;
}

export default function Comment({ postId }: Props) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState('');

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [newReply, setNewReply] = useState('');

  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editingReplyContent, setEditingReplyContent] = useState('');

  const totalCount = comments.reduce((acc, c) => acc + 1 + (c.children?.length ?? 0), 0);

  const fetchComments = async () => {
    if (!postId) return;
    try {
      const data = await getCommunityComments(postId);
      setComments(data);
    } catch {
      ShowWarningToast('댓글을 불러오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // ── Comment handlers ──

  const handleAddComment = async () => {
    if (!newComment.trim() || !postId) return;
    try {
      await postCommunityComments(postId, newComment.trim());
      setNewComment('');
      await fetchComments();
    } catch {
      ShowWarningToast('댓글 등록에 실패했습니다.');
    }
  };

  const handleEditCommentStart = (comment: CommentData) => {
    setEditingCommentId(comment.commentId);
    setEditingCommentContent(comment.content);
  };

  const handleEditCommentSave = async (commentId: string) => {
    if (!editingCommentContent.trim()) return;
    try {
      await updateCommunityComment(commentId, editingCommentContent.trim());
      setEditingCommentId(null);
      setEditingCommentContent('');
      await fetchComments();
    } catch {
      ShowWarningToast('댓글 수정에 실패했습니다.');
    }
  };

  const handleEditCommentCancel = () => {
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteCommunityComment(commentId);
      await fetchComments();
    } catch {
      ShowWarningToast('댓글 삭제에 실패했습니다.');
    }
  };

  // ── Reply handlers ──

  const handleReplyOpen = (commentId: string) => {
    setReplyingToId((prev) => (prev === commentId ? null : commentId));
    setNewReply('');
  };

  const handleAddReply = async (parentCommentId: string) => {
    if (!newReply.trim() || !postId) return;
    try {
      await postCommunityComments(postId, newReply.trim(), parentCommentId);
      setNewReply('');
      setReplyingToId(null);
      await fetchComments();
    } catch {
      ShowWarningToast('답글 등록에 실패했습니다.');
    }
  };

  const handleEditReplyStart = (reply: CommentData) => {
    setEditingReplyId(reply.commentId);
    setEditingReplyContent(reply.content);
  };

  const handleEditReplySave = async (replyId: string) => {
    if (!editingReplyContent.trim()) return;
    try {
      await updateCommunityComment(replyId, editingReplyContent.trim());
      setEditingReplyId(null);
      setEditingReplyContent('');
      await fetchComments();
    } catch {
      ShowWarningToast('답글 수정에 실패했습니다.');
    }
  };

  const handleEditReplyCancel = () => {
    setEditingReplyId(null);
    setEditingReplyContent('');
  };

  const handleDeleteReply = async (replyId: string) => {
    try {
      await deleteCommunityComment(replyId);
      await fetchComments();
    } catch {
      ShowWarningToast('답글 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="border-t border-gray-100 px-8 py-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">댓글 {totalCount}개</h3>

      <div className="space-y-5">
        {comments.map((comment) => {
          const isOwner = user?.uuid === comment.writerUuid;
          const isEditing = editingCommentId === comment.commentId;
          const isReplying = replyingToId === comment.commentId;

          return (
            <div key={comment.commentId}>
              {/* 댓글 */}
              <div className="flex gap-3">
                <a href={`/profile/${comment.writerCustomId}`}>
                  <Avatar name={comment.writer} src={comment.writerProfileImage} />
                </a>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-800">{comment.writer}</span>
                    <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        className="w-full text-sm text-gray-700 border border-blue-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100"
                        rows={3}
                        value={editingCommentContent}
                        onChange={(e) => setEditingCommentContent(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCommentSave(comment.commentId)}
                          className="text-xs px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          저장
                        </button>
                        <button
                          onClick={handleEditCommentCancel}
                          className="text-xs px-3 py-1 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap wrap-break-word">
                      <ReactMarkdown components={markdownComponents}>
                        {comment.content}
                      </ReactMarkdown>
                    </div>
                  )}

                  {!isEditing && (
                    <div className="flex gap-3 mt-1.5">
                      <button
                        onClick={() => handleReplyOpen(comment.commentId)}
                        className="text-xs text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        {isReplying ? '취소' : '답글 달기'}
                      </button>
                      {isOwner && (
                        <>
                          <button
                            onClick={() => handleEditCommentStart(comment)}
                            className="text-xs text-gray-400 hover:text-blue-500 transition-colors"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.commentId)}
                            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 응답 */}
              {(comment.children?.length ?? 0) > 0 && (
                <div className="ml-11 mt-3 space-y-3">
                  {comment.children!.map((reply) => {
                    const isReplyOwner = user?.uuid === reply.writerUuid;
                    const isEditingReply = editingReplyId === reply.commentId;

                    return (
                      <div key={reply.commentId} className="flex gap-2">
                        <CornerDownRight className="w-4 h-4 text-gray-300 mt-1 shrink-0" />
                        <a href={`/profile/${reply.writerCustomId}`}>
                          <Avatar name={reply.writer} src={reply.writerProfileImage} size="xs" />
                        </a>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold text-gray-800">
                              {reply.writer}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {timeAgo(reply.createdAt)}
                            </span>
                          </div>

                          {isEditingReply ? (
                            <div className="space-y-2">
                              <textarea
                                className="w-full text-xs text-gray-700 border border-blue-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100"
                                rows={2}
                                value={editingReplyContent}
                                onChange={(e) => setEditingReplyContent(e.target.value)}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditReplySave(reply.commentId)}
                                  className="text-xs px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                  저장
                                </button>
                                <button
                                  onClick={handleEditReplyCancel}
                                  className="text-xs px-3 py-1 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  취소
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                              <ReactMarkdown components={markdownComponents}>
                                {reply.content}
                              </ReactMarkdown>
                            </div>
                          )}

                          {isReplyOwner && !isEditingReply && (
                            <div className="flex gap-3 mt-1">
                              <button
                                onClick={() => handleEditReplyStart(reply)}
                                className="text-[11px] text-gray-400 hover:text-blue-500 transition-colors"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => handleDeleteReply(reply.commentId)}
                                className="text-[11px] text-gray-400 hover:text-red-500 transition-colors"
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── Inline reply input ── */}
              {isReplying && (
                <div className="ml-11 mt-3 flex gap-2">
                  <CornerDownRight className="w-4 h-4 text-gray-300 mt-2.5 shrink-0" />
                  <Avatar
                    name={user?.userNickname ?? '?'}
                    src={user?.profileImage ?? ''}
                    size="xs"
                  />
                  <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <textarea
                      className="w-full px-3 pt-2 pb-1 text-xs text-gray-700 resize-none focus:outline-none"
                      rows={2}
                      placeholder={`${comment.writer}님에게 답글 달기...`}
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddReply(comment.commentId);
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex justify-end px-2 pb-1.5">
                      <button
                        onClick={() => handleAddReply(comment.commentId)}
                        disabled={!newReply.trim()}
                        className="text-xs px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        등록
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── New comment input ── */}
      <div className="mt-6 flex gap-3">
        <Avatar name={user?.userNickname ?? '?'} src={user?.profileImage ?? ''} />
        <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <textarea
            className="w-full px-4 pt-3 pb-2 text-sm text-gray-700 resize-none focus:outline-none"
            rows={2}
            placeholder="댓글을 입력하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />
          <div className="flex justify-end px-3 pb-2">
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="text-xs px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
