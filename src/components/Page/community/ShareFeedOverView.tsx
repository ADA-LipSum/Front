import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@/components/global/Avatar';
import { Heart, MessageCircle, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';

export interface ReactionItem {
  emoji: string;
  count: number;
}

export interface ShareFeedItem {
  id: number;
  username: string;
  realName: string;
  profileImage?: string;
  postedAt: string;
  title: string;
  description: string;
  images?: string[];
  videos?: string[];
  likes: number;
  comments: number;
  reactions?: ReactionItem[];
  isBookmarked?: boolean;
}

type MediaItem = { type: 'image'; url: string } | { type: 'video'; url: string };

function timeAgo(dateStr: string): string {
  const normalized =
    dateStr.endsWith('Z') || /[+\-]\d{2}:\d{2}$/.test(dateStr) ? dateStr : dateStr + 'Z';
  const date = new Date(normalized);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `약 ${diff}초 전`;
  if (diff < 3600) return `약 ${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `약 ${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

interface ShareFeedOverViewProps {
  feed: ShareFeedItem;
  onLike?: (id: number) => void;
  onComment?: (id: number) => void;
  onShare?: (id: number) => void;
}

export const ShareFeedOverView = ({ feed, onComment }: ShareFeedOverViewProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(feed.isBookmarked);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsBookmarked(feed.isBookmarked);
  }, [feed.isBookmarked]);

  useEffect(() => {
    if (!showPicker) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showPicker]);

  const mediaItems: MediaItem[] = [
    ...(feed.images ?? []).map((url): MediaItem => ({ type: 'image', url })),
    ...(feed.videos ?? []).map((url): MediaItem => ({ type: 'video', url })),
  ];
  const mediaCount = mediaItems.length;
  const hasMedia = mediaCount > 0;

  const prev = () => setCurrentIndex((i) => (i - 1 + mediaCount) % mediaCount);
  const next = () => setCurrentIndex((i) => (i + 1) % mediaCount);

  return (
    <div className="flex gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors">
      {/* Avatar 컬럼 */}
      <div className="shrink-0 pt-0.5">
        {feed.profileImage ? (
          <Avatar name={feed.realName} src={feed.profileImage} size="md" />
        ) : (
          <div className="w-10 h-10 rounded-sm bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
            {feed.realName.charAt(0)}
          </div>
        )}
      </div>

      {/* 콘텐츠 컬럼 */}
      <div className="flex-1 min-w-0">
        {/* 이름 + 핸들 + 시간 + 공유 */}
        <div className="flex items-center gap-1.5 flex-wrap leading-none">
          <span className="text-sm font-bold text-gray-900">{feed.realName}</span>
          <span className="text-xs text-gray-400">@{feed.username}</span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-400">{timeAgo(feed.postedAt)}</span>
          <div
            className={`ml-auto transition-colors ${isBookmarked ? 'text-[#2B7FFF]' : 'text-gray-300 hover:text-[#2B7FFF]'}`}
          >
            <Bookmark size={16} className={isBookmarked ? 'fill-[#2B7FFF]' : ''} />
          </div>
        </div>

        {/* 미디어 캐러셀 */}
        {hasMedia && (
          <div
            className="mt-2 rounded-sm overflow-hidden bg-gray-100 relative cursor-pointer border border-gray-100"
            onClick={() => navigate(`/article/${feed.id}`)}
          >
            {mediaItems[currentIndex].type === 'video' ? (
              <video
                src={mediaItems[currentIndex].url}
                className="w-full h-auto max-h-150 object-cover"
                controls
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={mediaItems[currentIndex].url}
                alt={`미디어 ${currentIndex + 1}`}
                className="w-full h-auto max-h-150 object-cover"
              />
            )}
            {mediaCount > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-sm bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-sm bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                >
                  <ChevronRight size={15} />
                </button>
                <span className="absolute top-2 right-2 text-xs text-white bg-black/40 backdrop-blur-sm rounded-sm px-2 py-0.5">
                  {currentIndex + 1}/{mediaCount}
                </span>
              </>
            )}
          </div>
        )}

        {/* 제목 */}
        <p
          className="text-sm font-medium text-gray-800 mt-3 leading-snug cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => navigate(`/article/${feed.id}`)}
        >
          {feed.title}
        </p>

        {/* 본문 미리보기 */}
        {feed.description && (
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-3 leading-relaxed">
            {feed.description}
          </p>
        )}

        {/* 액션 바 */}
        <div className="flex items-center gap-5 mt-5 text-gray-400">
          <button
            onClick={() => onComment?.(feed.id)}
            className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"
          >
            <MessageCircle size={16} />
            <span className="text-xs">{feed.comments}</span>
          </button>
          <div
            className="flex items-center gap-1.5 transition-colors group
            "
          >
            <Heart size={16} className="transition-all" color="#FF2056" />
            <span className="text-xs">{feed.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
