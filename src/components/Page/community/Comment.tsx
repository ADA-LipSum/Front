import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { CornerDownRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { markdownComponents } from '@/components/Library/React-Markdown-Syntax/MarkdownComponents';

interface ReplyData {
  replyId: string;
  writerUuid: string;
  writer: string;
  writerProfileImage: string;
  content: string;
  createdAt: string;
}

interface CommentData {
  commentId: string;
  writerUuid: string;
  writer: string;
  writerProfileImage: string;
  content: string;
  createdAt: string;
  replies: ReplyData[];
}

const MOCK_COMMENTS: CommentData[] = [
  {
    commentId: '1',
    writerUuid: 'mock-user-a',
    writer: '홍길동',
    writerProfileImage: '',
    content: `좋은 글이네요! 저는 아래처럼 구현해봤는데 잘 동작하더라고요.

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

혹시 다른 방법도 있을까요?`,
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    replies: [
      {
        replyId: 'r1',
        writerUuid: 'mock-user-b',
        writer: '김철수',
        writerProfileImage: '',
        content: `오, 저는 이렇게 했어요!

\`\`\`python
def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("World"))
\`\`\`

파이썬 버전입니다 😄`,
        createdAt: new Date(Date.now() - 3000 * 1000).toISOString(),
      },
    ],
  },
  {
    commentId: '2',
    writerUuid: 'mock-user-b',
    writer: '김철수',
    writerProfileImage: '',
    content: `저도 비슷한 문제를 겪었는데 이렇게 해결할 수 있군요! \`npm install react-markdown\` 으로 설치하면 바로 쓸 수 있어요.`,
    createdAt: new Date(Date.now() - 7200 * 1000).toISOString(),
    replies: [],
  },
  {
    commentId: '3',
    writerUuid: 'mock-user-c',
    writer: '이영희',
    writerProfileImage: '',
    content: `감사합니다! 덕분에 프로젝트가 한층 더 좋아졌어요.`,
    createdAt: new Date(Date.now() - 10800 * 1000).toISOString(),
    replies: [],
  },
  {
    commentId: '4',
    writerUuid: 'mock-user-a',
    writer: '홍길동',
    writerProfileImage: '',
    content: `추가로 궁금한 점이 있는데, 혹시 이 방법이 모든 상황에서 적용 가능한가요?`,
    createdAt: new Date(Date.now() - 14400 * 1000).toISOString(),
    replies: [],
  },
];

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}초전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간전`;
  return `${Math.floor(diff / 86400)}일전`;
}

function Avatar({ name, src, size = 'sm' }: { name: string; src: string; size?: 'sm' | 'xs' }) {
  const cls = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-6 h-6 text-[10px]';
  if (src) {
    return <img src={src} alt={name} className={`${cls} rounded-full object-cover shrink-0`} />;
  }
  return (
    <div
      className={`${cls} rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0`}
    >
      {name.charAt(0)}
    </div>
  );
}

interface Props {
  postId?: string;
}

export default function Comment({ postId: _postId }: Props) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<CommentData[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [newReply, setNewReply] = useState('');

  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editingReplyContent, setEditingReplyContent] = useState('');

  const totalCount = comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);

  // ── Comment handlers ──

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;
    const comment: CommentData = {
      commentId: Date.now().toString(),
      writerUuid: user.uuid,
      writer: user.userNickname,
      writerProfileImage: user.profileImage,
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
      replies: [],
    };
    setComments((prev) => [...prev, comment]);
    setNewComment('');
  };

  const handleEditCommentStart = (comment: CommentData) => {
    setEditingCommentId(comment.commentId);
    setEditingCommentContent(comment.content);
  };

  const handleEditCommentSave = (commentId: string) => {
    if (!editingCommentContent.trim()) return;
    setComments((prev) =>
      prev.map((c) =>
        c.commentId === commentId ? { ...c, content: editingCommentContent.trim() } : c,
      ),
    );
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  const handleEditCommentCancel = () => {
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.commentId !== commentId));
  };

  // ── Reply handlers ──

  const handleReplyOpen = (commentId: string) => {
    setReplyingToId((prev) => (prev === commentId ? null : commentId));
    setNewReply('');
  };

  const handleAddReply = (commentId: string) => {
    if (!newReply.trim() || !user) return;
    const reply: ReplyData = {
      replyId: `${commentId}-${Date.now()}`,
      writerUuid: user.uuid,
      writer: user.userNickname,
      writerProfileImage: user.profileImage,
      content: newReply.trim(),
      createdAt: new Date().toISOString(),
    };
    setComments((prev) =>
      prev.map((c) => (c.commentId === commentId ? { ...c, replies: [...c.replies, reply] } : c)),
    );
    setNewReply('');
    setReplyingToId(null);
  };

  const handleEditReplyStart = (reply: ReplyData) => {
    setEditingReplyId(reply.replyId);
    setEditingReplyContent(reply.content);
  };

  const handleEditReplySave = (commentId: string, replyId: string) => {
    if (!editingReplyContent.trim()) return;
    setComments((prev) =>
      prev.map((c) =>
        c.commentId === commentId
          ? {
              ...c,
              replies: c.replies.map((r) =>
                r.replyId === replyId ? { ...r, content: editingReplyContent.trim() } : r,
              ),
            }
          : c,
      ),
    );
    setEditingReplyId(null);
    setEditingReplyContent('');
  };

  const handleEditReplyCancel = () => {
    setEditingReplyId(null);
    setEditingReplyContent('');
  };

  const handleDeleteReply = (commentId: string, replyId: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.commentId === commentId
          ? { ...c, replies: c.replies.filter((r) => r.replyId !== replyId) }
          : c,
      ),
    );
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
              {/* ── Comment ── */}
              <div className="flex gap-3">
                <Avatar name={comment.writer} src={comment.writerProfileImage} />

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
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
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

              {/* ── Replies ── */}
              {comment.replies.length > 0 && (
                <div className="ml-11 mt-3 space-y-3">
                  {comment.replies.map((reply) => {
                    const isReplyOwner = user?.uuid === reply.writerUuid;
                    const isEditingReply = editingReplyId === reply.replyId;

                    return (
                      <div key={reply.replyId} className="flex gap-2">
                        <CornerDownRight className="w-4 h-4 text-gray-300 mt-1 shrink-0" />
                        <Avatar name={reply.writer} src={reply.writerProfileImage} size="xs" />

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
                                  onClick={() =>
                                    handleEditReplySave(comment.commentId, reply.replyId)
                                  }
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
                                onClick={() => handleDeleteReply(comment.commentId, reply.replyId)}
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
