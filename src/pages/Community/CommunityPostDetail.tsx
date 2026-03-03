import { useParams, useNavigate } from 'react-router-dom';
import { useCommunity } from '@/contexts/CommunityContext';
import { PostDetailContent } from '@/components/community/PostDetailContent';
import { CommentList } from '@/components/community/CommentList';
import { CommentForm } from '@/components/community/CommentForm';
import { ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

export const CommunityPostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { getPostById, getCommentsByPostId, getTimeAgo, addComment } = useCommunity();
  const { user } = useSelector((state: RootState) => state.auth);

  const post = postId ? getPostById(postId) : undefined;
  const comments = postId ? getCommentsByPostId(postId) : [];

  const handleSubmitComment = (content: string, author: string) => {
    if (!postId) return;
    addComment({
      postId,
      author: author || (user?.userNickname ?? '익명'),
      content,
    });
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <p className="text-[#757575]">게시글을 찾을 수 없습니다.</p>
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
