import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchCommunityPostDetail as fetchPostDetail,
  toggleCommunityPostLike,
} from '@/api/community';
import { useAuthStore } from '@/store/authStore';
import { ShowWarningToast } from '@/components/Library/Toast/Toast';

import { Heart, Share2, Bookmark, Eye } from 'lucide-react';

interface PostDetail {
  postUuid: string;
  seq: number | null;
  writerUuid: string;
  writerCustomId: string;
  writer: string;
  writerProfileImage: string;
  title: string;
  content: string;
  images: string[] | null;
  videos: string[] | null;
  writedAt: string;
  updatedAt: string;
  likes: number;
  isLiked?: boolean;
  views: number;
  comments: number;
  isDev: boolean;
  devTags: string;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return ` ${diff}초전`;
  if (diff < 3600) return ` ${Math.floor(diff / 60)}분전`;
  if (diff < 86400) return ` ${Math.floor(diff / 3600)}시간전`;
  return ` ${Math.floor(diff / 86400)}일전`;
}

export const CommunityPostDetail = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, loading: authLoading } = useAuthStore();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      ShowWarningToast('로그인이 필요한 서비스입니다.');
      navigate('/');
      return;
    }
    if (!uuid) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchPostDetail(uuid);
        const postData = data as PostDetail;
        setPost(postData);
        setLikeCount(postData.likes ?? 0);
        setLiked(postData.isLiked ?? false);
      } catch {
        ShowWarningToast('게시물을 불러오는 데 실패했습니다.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [uuid, isLoggedIn, authLoading, navigate]);

  const handleLikeToggle = async () => {
    try {
      const nowLiked = (await toggleCommunityPostLike(uuid!)) as boolean;
      setLiked(nowLiked);
      setLikeCount((c) => c + (nowLiked ? 1 : -1));
    } catch {
      ShowWarningToast('좋아요 처리에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="min-h-screen py-5">
      <div className="flex justify-center gap-4 px-4">
        {/* ── Left sticky panel ── */}
        <div className="sticky top-8 self-start flex flex-col items-center gap-1 bg-white rounded-2xl shadow-sm border border-gray-100 py-4 px-3">
          <button
            onClick={handleLikeToggle}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              liked
                ? 'text-rose-500 bg-rose-50'
                : 'text-gray-400 hover:text-rose-400 hover:bg-rose-50'
            }`}
          >
            <Heart className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} />
            <span className="text-xs font-semibold">{likeCount}</span>
          </button>

          <div className="w-6 h-px bg-gray-100 my-1" />

          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 p-2 rounded-xl text-gray-400 hover:text-blue-400 hover:bg-blue-50 transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        {/* ── Main content ── */}
        <div className="w-full max-w-3xl rounded-lg shadow-sm">
          <div>
            {/* ── Post Header ── */}
            <div className="px-8 pt-8 pb-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs font-semibold border rounded-md px-2.5 py-1 bg-gray-50 text-gray-500 border-gray-200">
                  Q&A
                </span>

                {post.isDev && post.devTags && (
                  <span className="text-xs font-semibold border rounded-md px-2.5 py-1 bg-indigo-50 text-indigo-600 border-indigo-200">
                    {post.devTags}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-6">{post.title}</h1>

              {/* Author row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {post.writerProfileImage ? (
                    <img
                      src={post.writerProfileImage}
                      alt={post.writer}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                      {post.writer.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">
                      {post.writer}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">{timeAgo(post.writedAt)}</span>
                      <span className="text-gray-200">·</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Eye className="w-4 h-4" />
                        {post.views}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setBookmarked(!bookmarked)}
                  >
                    <Bookmark className="w-5 h-5" fill={bookmarked ? 'currentColor' : 'none'} />
                    스크랩
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors font-bold text-base tracking-widest">
                    ···
                  </button>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* ── Content + Like/Dislike ── */}
            <div className="flex">
              {/* Content */}
              <div className="flex-1 min-w-0 px-8 py-8">
                <p className="text-[15px] text-gray-700 leading-7 whitespace-pre-wrap">
                  {post.content}
                </p>

                {post.images && post.images.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {post.images.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`첨부 이미지 ${i + 1}`}
                        className="max-w-full rounded-xl border-gray-100"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Comment section ── */}
            <div className="border-t border-gray-100 px-8 py-5 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-sm text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
                댓글 쓰기
              </p>
            </div>
          </div>
        </div>
        {/* end main content */}
      </div>
    </div>
  );
};
