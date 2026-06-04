import { useState, useRef, useEffect } from 'react';
import Avatar from '@/components/global/Avatar';
import { Heart, MessageCircle, Share2, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const EMOJI_OPTIONS = [
  '😀',
  '😂',
  '😍',
  '🥰',
  '😮',
  '😢',
  '😡',
  '👍',
  '👎',
  '❤️',
  '🔥',
  '🎉',
  '🙏',
  '💪',
  '😎',
];

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
  likes: number;
  comments: number;
  reactions?: ReactionItem[];
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
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

export const ShareFeedOverView = ({ feed, onLike, onComment, onShare }: ShareFeedOverViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [reactions, setReactions] = useState<ReactionItem[]>(feed.reactions ?? []);
  const [myReaction, setMyReaction] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

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

  const handleReaction = (emoji: string) => {
    setShowPicker(false);
    setReactions((prev) => {
      const next = prev.map((r) => ({ ...r }));
      if (myReaction === emoji) {
        const idx = next.findIndex((r) => r.emoji === emoji);
        if (idx !== -1) next[idx].count = Math.max(0, next[idx].count - 1);
        setMyReaction(null);
        return next;
      }
      if (myReaction) {
        const oldIdx = next.findIndex((r) => r.emoji === myReaction);
        if (oldIdx !== -1) next[oldIdx].count = Math.max(0, next[oldIdx].count - 1);
      }
      const existing = next.findIndex((r) => r.emoji === emoji);
      if (existing !== -1) {
        next[existing].count += 1;
      } else {
        next.push({ emoji, count: 1 });
      }
      setMyReaction(emoji);
      return next;
    });
  };

  const images = feed.images ?? [];
  const imageCount = images.length;
  const hasImages = imageCount > 0;

  const prev = () => setCurrentIndex((i) => (i - 1 + imageCount) % imageCount);
  const next = () => setCurrentIndex((i) => (i + 1) % imageCount);

  const handleLike = () => {
    setLiked((v) => !v);
    onLike?.(feed.id);
  };

  return (
    <div className="w-180 bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        {feed.profileImage ? (
          <Avatar name={feed.realName} src={feed.profileImage} size="md" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {feed.realName.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-gray-800">{feed.realName}</span>
            <span className="text-xs text-gray-400">@{feed.username}</span>
          </div>
          <span className="text-xs text-gray-400">{timeAgo(feed.postedAt)}</span>
        </div>
      </div>

      {/* Image carousel */}
      {hasImages ? (
        <div className="relative w-full aspect-square bg-gray-100">
          <img
            src={images[currentIndex]}
            alt={`이미지 ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
          {imageCount > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      i === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                    }`}
                  />
                ))}
              </div>
              <span className="absolute top-3 right-3 text-xs text-white bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5 font-medium">
                {currentIndex + 1} / {imageCount}
              </span>
            </>
          )}
        </div>
      ) : (
        <div className="mx-4 mb-1 px-4 py-5 bg-gray-50 rounded-xl border border-gray-100 min-h-32 flex flex-col justify-center gap-1.5">
          <p className="text-sm font-semibold text-gray-800 leading-snug">{feed.title}</p>
          <p className="text-sm text-gray-500 leading-relaxed">{feed.description}</p>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 pb-4 pt-3 space-y-2.5">
        {hasImages && (
          <div>
            <p className="text-sm font-semibold text-gray-800 truncate">{feed.title}</p>
            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">
              {feed.description}
            </p>
          </div>
        )}
        <div className="flex items-center gap-1.5 flex-wrap">
          {reactions
            .filter((r) => r.count > 0)
            .map((r) => (
              <button
                key={r.emoji}
                onClick={() => handleReaction(r.emoji)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-all ${
                  myReaction === r.emoji
                    ? 'bg-blue-50 border-blue-300 text-blue-600'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{r.emoji}</span>
                <span>{r.count}</span>
              </button>
            ))}

          {/* + 버튼 & 픽커 */}
          <div className="relative" ref={pickerRef}>
            <button
              onClick={() => setShowPicker((v) => !v)}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-50 border border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
            >
              <Plus size={13} />
            </button>
            {showPicker && (
              <div className="absolute bottom-9 left-0 z-20 bg-white border border-gray-200 rounded-2xl shadow-lg p-2 w-52">
                <div className="grid grid-cols-5 gap-1">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className={`text-lg h-9 w-9 flex items-center justify-center rounded-xl transition-all hover:bg-gray-100 ${
                        myReaction === emoji ? 'bg-blue-50 ring-1 ring-blue-300' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 pt-0.5">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors group ${
              liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart
              size={16}
              className={`transition-all ${liked ? 'fill-red-500' : 'group-hover:fill-red-100'}`}
            />
            <span className="text-xs font-medium">{feed.likes + (liked ? 1 : 0)}</span>
          </button>
          <button
            onClick={() => onComment?.(feed.id)}
            className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <MessageCircle size={16} />
            <span className="text-xs font-medium">{feed.comments}</span>
          </button>
          <button
            onClick={() => onShare?.(feed.id)}
            className="ml-auto text-gray-400 hover:text-indigo-500 transition-colors"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000).toISOString();

export const MOCK_FEED_WITH_IMAGES: ShareFeedItem = {
  id: 1,
  username: 'rlaxogh76',
  realName: '김태호',
  profileImage:
    'https://2026project-s3-ada.s3.ap-northeast-2.amazonaws.com/profiles/1b6f8f54-a6e5-4cc3-bd30-afec528c29ed/19cbdc9e-7924-4fa3-9043-6e6cddb80168.jpg',
  postedAt: hoursAgo(2),
  title: '오늘 간 카페 너무 분위기 좋았어요',
  description:
    '종로에 새로 생긴 카페인데 아늑하고 커피도 진짜 맛있었어요. 혼자 공부하기 딱 좋은 공간이고 가격도 착했습니다. 다들 한번 가보세요!',
  images: [
    'https://i.ibb.co/HfwN14TC/Screenshot-20260523-155436-Instagram.jpg',
    'https://i.ibb.co/NnYsgQfB/20251101-135930.jpg',
  ],
  likes: 42,
  comments: 8,
  reactions: [
    { emoji: '❤️', count: 18 },
    { emoji: '😍', count: 11 },
    { emoji: '😂', count: 6 },
    { emoji: '👍', count: 14 },
    { emoji: '😮', count: 3 },
  ],
};

export const MOCK_FEED_TEXT_ONLY: ShareFeedItem = {
  id: 2,
  username: 'rlaxogh76',
  realName: '김태호',
  profileImage:
    'https://2026project-s3-ada.s3.ap-northeast-2.amazonaws.com/profiles/1b6f8f54-a6e5-4cc3-bd30-afec528c29ed/19cbdc9e-7924-4fa3-9043-6e6cddb80168.jpg',
  postedAt: hoursAgo(5),
  title: '집가고 싶다 1일차',
  description:
    '집에 가고 싶다 1일차. 오늘도 힘들었지만 그래도 조금씩 나아지고 있는 것 같아서 기분이 좋다.',
  likes: 17,
  comments: 4,
  reactions: [
    { emoji: '😢', count: 9 },
    { emoji: '❤️', count: 5 },
    { emoji: '👍', count: 3 },
  ],
};
