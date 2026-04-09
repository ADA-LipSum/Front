import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PostDetailContent } from '@/components/community/PostDetailContent';
import { CommentList } from '@/components/community/CommentList';
import { CommentForm } from '@/components/community/CommentForm';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchCommunityPostDetail, togglePostLike } from '@/api/posts';
import { createComment, fetchPostComments } from '@/api/comments';
import type { CommunityComment, CommunityPost } from '@/types/community';
import { getTimeAgo } from '@/utils/time';

export const CommunityPostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    if (!postId) return;

    const load = async () => {
      try {
        setLoading(true);
        const [detail, commentList] = await Promise.all([
          fetchCommunityPostDetail(postId),
          fetchPostComments(postId),
        ]);
        setPost(detail);
        setComments(commentList);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [postId]);

  const handleSubmitComment = (content: string, author: string) => {
    if (!postId) return;

    const nickname = author || (user?.userNickname ?? '익명');

    // 낙관적 UI 업데이트
    const tempId = `temp-${Date.now()}`;
    const optimisticComment: CommunityComment = {
      id: tempId,
      postId,
      author: nickname,
      content,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, optimisticComment]);

    createComment({ postUuid: postId, content })
      .then(async () => {
        try {
          const latest = await fetchPostComments(postId);
          setComments(latest);
        } catch {
          // ignore, optimistic 상태 유지
        }
      })
      .catch(() => {
        setComments((prev) => prev.filter((c) => c.id !== tempId));
        alert('댓글 등록에 실패했습니다.');
      });
  };

  const handleToggleLike = async () => {
    if (!postId || !post || likeLoading) return;
    try {
      setLikeLoading(true);
      await togglePostLike(postId);
      const latest = await fetchCommunityPostDetail(postId);
      setPost(latest);
    } catch (err) {
      console.error(err);
      alert('좋아요 처리에 실패했습니다.');
    } finally {
      setLikeLoading(false);
    }
  };

  // handleDelete: 삭제는 선택 구현(c3)에서 처리 예정

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <p className="text-[#757575]">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <p className="text-[#757575]">
            {error ?? '게시글을 찾을 수 없습니다.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/community')}
            className="mt-4 text-[#4A4A4A] font-medium hover:underline"
          >
            목록으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <button
          type="button"
          onClick={() => navigate('/community')}
          className="flex items-center gap-2 text-[#4A4A4A] font-medium hover:text-black mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          목록으로
        </button>

        <div className="mb-4 flex justify-between items-center">
          <span className="text-sm text-[#9E9E9E]">
            조회수 {post.views ?? 0} · 댓글 {post.commentsCount ?? comments.length}
          </span>
          <button
            type="button"
            onClick={handleToggleLike}
            disabled={likeLoading}
            className="px-3 py-1 rounded border border-[#E0E0E0] text-sm hover:bg-[#FAFAFA] disabled:opacity-60"
          >
            ❤️ 좋아요 {post.likes ?? 0}
          </button>
        </div>

        <PostDetailContent post={post} getTimeAgo={getTimeAgo} />

        <section className="mt-6">
          <h2 className="text-lg font-bold text-black mb-2">
            댓글 <span className="text-[#757575] font-normal">{comments.length}개</span>
          </h2>
          <CommentForm
            onSubmit={handleSubmitComment}
            placeholderAuthor={user?.userNickname ?? '닉네임'}
          />
          <CommentList comments={comments} getTimeAgo={getTimeAgo} />
        </section>
      </div>
    </div>
  );
};
