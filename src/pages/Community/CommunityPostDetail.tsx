import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostDetail } from '@/api/posts';
import { useAuthStore } from '@/store/authStore';
import { ShowWarningToast } from '@/components/Library/Toast/Toast';

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
  views: number;
  comments: number;
  isDev: boolean;
  devTags: string;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `약 ${diff}초전`;
  if (diff < 3600) return `약 ${Math.floor(diff / 60)}분전`;
  if (diff < 86400) return `약 ${Math.floor(diff / 3600)}시간전`;
  return `약 ${Math.floor(diff / 86400)}일전`;
}

const BackIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const BookmarkIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const ThumbUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
  </svg>
);

const ThumbDownIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
  </svg>
);


export const CommunityPostDetail = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      ShowWarningToast('로그인이 필요한 서비스입니다.');
      navigate('/community');
      return;
    }
    if (!uuid) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchPostDetail(uuid);
        setPost(data);
      } catch {
        ShowWarningToast('게시물을 불러오는 데 실패했습니다.');
        navigate('/community');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [uuid, isLoggedIn, navigate]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back */}
        <button
          onClick={() => navigate('/community')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-5 transition-colors"
        >
          <BackIcon />
          목록으로
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
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
            <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-6">
              {post.title}
            </h1>

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
                      <EyeIcon />
                      {post.views}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <ShareIcon />
                  공유
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <BookmarkIcon />
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
            {/* Like / Dislike rail */}
            <div className="flex flex-col items-center gap-2 w-20 shrink-0 border-r border-gray-100 py-8 px-4">
              <button className="group flex flex-col items-center gap-1.5 text-gray-300 hover:text-blue-500 transition-colors">
                <span className="group-hover:scale-110 transition-transform">
                  <ThumbUpIcon />
                </span>
                <span className="text-sm font-bold text-gray-500">{post.likes}</span>
              </button>
              <div className="w-6 h-px bg-gray-200 my-1" />
              <button className="group flex flex-col items-center gap-1.5 text-gray-300 hover:text-red-400 transition-colors">
                <span className="group-hover:scale-110 transition-transform">
                  <ThumbDownIcon />
                </span>
                <span className="text-sm font-bold text-gray-500">0</span>
              </button>
            </div>

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
                      className="max-w-full rounded-xl border border-gray-100"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Comment section ── */}
          <div className="border-t border-gray-100 px-8 py-5 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
              댓글 쓰기
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
