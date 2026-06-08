import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getCommunityPostDetail,
  toggleCommunityPostLike,
  toggleBookmark,
  type PostDetail,
  type EmojiReaction,
} from '@/api/community';
import { useAuthStore } from '@/store/authStore';
import { ShowWarningToast } from '@/components/Library/Toast/Toast';
import { Heart, Share2, Bookmark, Eye, Paperclip, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { markdownComponents } from '@/components/Library/React-Markdown-Syntax/MarkdownComponents';
import Comment from '@/components/Page/community/Comment';
import { Poll } from '@/components/Page/community/Poll';

const COMMUNITY_CATEGORY_LABEL: Record<string, string> = {
  CHAT: '잡담',
  MEME: '밈',
  PROJECT_SHOWCASE: '프로젝트 자랑',
  TECH: '개발',
};

const TECH_SUB_TAG_LABEL: Record<string, string> = {
  QUESTION: '질문',
  CHAT: '잡담',
  TIP: '팁',
  POLL: '투표',
};

const FILE_SIZE_LABEL = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

function parseMediaUrls(raw: string | string[] | null): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {}
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export const CommunityPostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, loading: authLoading } = useAuthStore();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [reactions, setReactions] = useState<EmojiReaction[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      ShowWarningToast('로그인이 필요한 서비스입니다.');
      navigate('/');
      return;
    }
    if (!postId) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getCommunityPostDetail(postId);
        setPost(data);
        setLikeCount(data.likes ?? 0);
        setLiked(data.isLiked ?? false);
        setBookmarked(data.isBookmarked ?? false);
        setReactions(data.emojiReactions ?? []);
      } catch {
        ShowWarningToast('게시물을 불러오는 데 실패했습니다.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [postId, isLoggedIn, authLoading, navigate]);

  const handleLikeToggle = async () => {
    try {
      const nowLiked = (await toggleCommunityPostLike(postId!)) as boolean;
      setLiked(nowLiked);
      setLikeCount((c) => c + (nowLiked ? 1 : -1));
    } catch {
      ShowWarningToast('좋아요 처리에 실패했습니다.');
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      const nowBookmarked = (await toggleBookmark(postId!)) as boolean;
      setBookmarked(nowBookmarked);
    } catch {
      ShowWarningToast('북마크 처리에 실패했습니다.');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
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

  const categoryLabel = COMMUNITY_CATEGORY_LABEL[post.communityCategory] ?? post.communityCategory;
  const subTagLabel = post.techSubTag ? (TECH_SUB_TAG_LABEL[post.techSubTag] ?? post.techSubTag) : null;

  return (
    <div className="min-h-screen py-5">
      <div className="flex justify-center gap-4 px-4">
        {/* ── Left sticky panel ── */}
        <div className="py-50 self-start flex flex-col items-center gap-1 px-3">
          <button
            onClick={handleLikeToggle}
            className={`flex flex-col items-center gap-1 p-5 rounded-xl transition-all ${
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
            className="flex flex-col items-center gap-1 p-5 rounded-xl text-gray-400 hover:text-blue-400 hover:bg-blue-50 transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <div className="w-6 h-px bg-gray-100 my-1" />
        </div>

        {/* ── Main content ── */}
        <div className="w-full max-w-3xl rounded-lg">
          <div>
            {/* ── Post Header ── */}
            <div className="px-8 pt-8 pb-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {categoryLabel && (
                  <span className="text-xs font-semibold rounded-md px-2.5 py-1 bg-gray-100 text-gray-500">
                    {categoryLabel}
                  </span>
                )}
                {subTagLabel && (
                  <span className="text-xs font-semibold rounded-md px-2.5 py-1 bg-indigo-50 text-indigo-500">
                    {subTagLabel}
                  </span>
                )}
                {(post.techTags ?? []).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold rounded-md px-2.5 py-1 bg-blue-400 text-white"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-6">{post.title}</h1>

              {/* Author row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {post.writerProfileImage ? (
                    <a href={`/profile/${post.writerCustomId}`}>
                      <img
                        src={post.writerProfileImage}
                        alt={post.writer}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                      />
                    </a>
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
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={handleBookmarkToggle}
                  >
                    <Bookmark className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} />
                    북마크
                  </button>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* ── Content ── */}
            <div className="px-8 py-8">
              <div className="markdown-preview text-[15px] leading-7">
                <ReactMarkdown components={markdownComponents}>{post.content}</ReactMarkdown>
              </div>

              {/* Images */}
              {(() => {
                const imgs = parseMediaUrls(post.images);
                return imgs.length > 0 ? (
                  <div className="mt-6 space-y-3">
                    {imgs.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`첨부 이미지 ${i + 1}`}
                        className="max-w-full rounded-xl border border-gray-100"
                      />
                    ))}
                  </div>
                ) : null;
              })()}

              {/* Poll */}
              {(post.poll || post.techSubTag === 'POLL') && (
                <Poll postUuid={post.postUuid} initialPoll={post.poll} />
              )}

              {/* Emoji reactions */}
              {reactions.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {reactions.map((r) => (
                      <button
                        key={r.emoji}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                          r.reacted
                            ? 'bg-blue-50 border-blue-300 text-blue-600'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <span>{r.emoji}</span>
                        <span className="font-medium">{r.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {post.attachments && post.attachments.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5" />
                    첨부파일 {post.attachments.length}개
                  </p>
                  <div className="space-y-2">
                    {post.attachments.map((file) => (
                      <a
                        key={file.id}
                        href={file.fileUrl}
                        download={file.fileName}
                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Paperclip className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-700 truncate">{file.fileName}</span>
                          <span className="text-xs text-gray-400 shrink-0">
                            {FILE_SIZE_LABEL(file.fileSize)}
                          </span>
                        </div>
                        <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Comments ── */}
          <Comment postId={postId} />
        </div>
      </div>
    </div>
  );
};
