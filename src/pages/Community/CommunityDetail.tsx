/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import { api } from '@/api/client';
import { markdownComponents } from '@/components/Markdown/MarkdownComponents';

type PostDetail = {
  postUuid: string;
  seq: number;
  writerUuid: string;
  title: string;
  content: string;
  images: string | null;
  videos: string | null;
  writer: string;
  writerProfileImage: string | null;
  writedAt: string;
  updatedAt: string;
  likes: number;
  views: number;
  comments: number;
  isDev: boolean;
  devTags: string | null;
};

type Comment = {
  commentId: number;
  writerUuid: string;
  writer: string;
  writerProfileImage: string | null;
  content: string;
  createdAt: string;
  children?: Comment[];
};

export default function CommunityDetail() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 댓글 관련 상태
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [replyInput, setReplyInput] = useState<{ [key: number]: string }>({});
  const [openReply, setOpenReply] = useState<{ [key: number]: boolean }>({});

  const token = localStorage.getItem('access_token');

  // 게시글 상세 불러오기
  useEffect(() => {
    if (!uuid) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`api/posts/${uuid}`);
        setPost(res.data.data);
      } catch (err) {
        console.error(err);
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [uuid]);

  // 댓글 목록 불러오기
  const fetchComments = async () => {
    if (!uuid) return;

    try {
      const res = await api.get(`/api/comments/${uuid}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setComments(res.data);
    } catch (err) {
      console.error('댓글 조회 실패:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [uuid]);

  // 날짜 포맷 함수
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  // 댓글 작성
  const submitComment = async () => {
    if (!commentInput.trim()) return;

    try {
      await api.post(
        '/api/comments',
        { postId: uuid, content: commentInput },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      setCommentInput('');
      fetchComments();

      // 댓글 수 프론트에서 증가
      setPost(prev => (prev ? { ...prev, comments: prev.comments + 1 } : prev));
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      alert('댓글 작성 실패');
    }
  };

  // 대댓글 작성

  const submitReply = async (parentId: number) => {
    if (!replyInput[parentId]?.trim()) return;

    try {
      await api.post(
        '/api/comments',
        {
          postId: uuid,
          parentId,
          content: replyInput[parentId],
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      setReplyInput(prev => ({ ...prev, [parentId]: '' }));
      fetchComments();
    } catch (err) {
      console.error('대댓글 작성 실패:', err);
    }
  };

  // 댓글 좋아요 토글

  const toggleLike = async (commentId: number) => {
    try {
      await api.post(
        `/api/comments/${commentId}/like`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      // 좋아요 처리 후 새로고침
      fetchComments();
    } catch (err) {
      console.error('댓글 좋아요 실패:', err);
      alert('로그인이 필요합니다.');
    }
  };

  // 로딩 / 오류 처리

  if (loading || !post) {
    return (
      <div className="max-w-3xl px-4 py-6 mx-auto">
        <div className="px-6 py-6 text-sm text-center text-gray-500 bg-white shadow rounded-xl">
          불러오는 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl px-4 py-6 mx-auto">
        <div className="px-6 py-6 text-sm text-center text-red-500 bg-white shadow rounded-xl">
          {error}
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 text-xs bg-white border border-gray-300 rounded-full hover:bg-gray-50"
          >
            ← 뒤로가기
          </button>
        </div>
      </div>
    );
  }

  // 상세 페이지 UI

  return (
    <div className="max-w-3xl px-4 py-6 mx-auto">
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center px-4 py-2 mb-4 text-xs bg-white border border-gray-300 rounded-full hover:bg-gray-50"
      >
        ← 목록으로
      </button>

      {/* 게시글 상세 */}
      <div className="px-6 py-6 bg-white shadow rounded-xl">
        <img
          src={post.writerProfileImage || '/default-profile.png'}
          className="object-cover w-10 h-10 mb-4 rounded-full"
        />

        <h1 className="text-xl font-semibold">{post.title}</h1>

        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <span>{post.writer}</span>
          <span>· {formatDate(post.writedAt)}</span>
        </div>

        <div className="mt-3 flex gap-2 text-[10px] text-gray-600">
          <span className="px-2 py-0.5 bg-gray-100 rounded-full">조회 {post.views}</span>
          <span className="px-2 py-0.5 bg-gray-100 rounded-full">좋아요 {post.likes}</span>
          <span className="px-2 py-0.5 bg-gray-100 rounded-full">댓글 {post.comments}</span>
        </div>

        <div className="mt-6 text-sm leading-relaxed text-gray-800">
          <div className="prose-sm prose max-w-none">
            <ReactMarkdown components={markdownComponents}>{post.content}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* 댓글 작성 */}
      <div className="px-5 py-4 mt-6 bg-white shadow rounded-xl">
        <h2 className="mb-2 text-sm font-semibold">댓글 작성</h2>

        <textarea
          value={commentInput}
          onChange={e => setCommentInput(e.target.value)}
          rows={3}
          className="w-full p-3 text-sm border border-gray-300 rounded-md"
          placeholder="댓글을 입력하세요..."
        />

        <div className="flex justify-end mt-2">
          <button
            onClick={submitComment}
            className="px-4 py-2 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            등록
          </button>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="mt-6 space-y-4">
        {comments.map(c => (
          <div key={c.commentId} className="px-5 py-4 bg-white shadow rounded-xl">
            <div className="flex gap-3">
              <img
                src={c.writerProfileImage || '/default-profile.png'}
                className="rounded-full w-9 h-9"
              />

              <div className="flex-1">
                {/* 상위 댓글 */}
                <div className="flex gap-2 text-xs text-gray-600">
                  <span>{c.writer}</span>
                  <span>· {formatDate(c.createdAt)}</span>
                </div>

                <p className="mt-1 text-sm whitespace-pre-line">{c.content}</p>

                {/* 좋아요 + 답글 */}
                <div className="flex gap-3 mt-2 text-[11px] text-gray-500">
                  <button onClick={() => toggleLike(c.commentId)} className="hover:text-blue-600">
                    👍 좋아요
                  </button>

                  <button
                    onClick={() =>
                      setOpenReply(prev => ({
                        ...prev,
                        [c.commentId]: !prev[c.commentId],
                      }))
                    }
                    className="hover:text-black"
                  >
                    💬 답글
                  </button>
                </div>

                {/* 대댓글 입력창 */}
                {openReply[c.commentId] && (
                  <div className="mt-3 ml-6">
                    <textarea
                      value={replyInput[c.commentId] || ''}
                      onChange={e =>
                        setReplyInput(prev => ({
                          ...prev,
                          [c.commentId]: e.target.value,
                        }))
                      }
                      rows={2}
                      className="w-full p-2 text-sm border border-gray-300 rounded-md"
                      placeholder="답글을 입력하세요..."
                    />

                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => submitReply(c.commentId)}
                        className="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        답글 달기
                      </button>
                    </div>
                  </div>
                )}

                {/* 대댓글 목록 */}
                {c.children && c.children.length > 0 && (
                  <div className="mt-4 ml-8 space-y-3">
                    {c.children.map(child => (
                      <div key={child.commentId} className="pl-3 border-l border-gray-300">
                        <div className="flex gap-2 text-xs text-gray-600">
                          <span>{child.writer}</span>
                          <span>· {formatDate(child.createdAt)}</span>
                        </div>

                        <p className="mt-1 text-sm whitespace-pre-line">{child.content}</p>

                        <button
                          onClick={() => toggleLike(child.commentId)}
                          className="mt-1 text-[11px] text-gray-500 hover:text-blue-600"
                        >
                          👍 좋아요
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
