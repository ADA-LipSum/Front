import { Eye } from 'lucide-react';

export interface TechPostOverViewItem {
  postUuid: string;
  title: string;
  writer: string;
  writerProfileImage?: string;
  writedAt: string;
  views: number;
  tag?: string;
  thumbnail?: string;
  thumbnailEmoji?: string;
  thumbnailBg?: string;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `약 ${diff}초 전`;
  if (diff < 3600) return `약 ${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `약 ${Math.floor(diff / 3600)}시간 전`;
  return `약 ${Math.floor(diff / 86400)}일 전`;
}

const TAG_COLORS: Record<string, string> = {
  'Tech 뉴스': 'text-blue-500 bg-blue-50 border-blue-100',
  기술: 'text-blue-500 bg-blue-50 border-blue-100',
  커리어: 'text-violet-500 bg-violet-50 border-violet-100',
  기타: 'text-gray-400 bg-gray-50 border-gray-200',
  팁: 'text-emerald-500 bg-emerald-50 border-emerald-100',
  칼럼: 'text-orange-500 bg-orange-50 border-orange-100',
};

const PostCard = ({ post, onClick }: { post: TechPostOverViewItem; onClick?: () => void }) => (
  <div
    onClick={onClick}
    className="flex gap-3 p-3.5 bg-white rounded-xl border border-gray-100 hover:border-violet-100 hover:shadow-md cursor-pointer transition-all group"
  >
    <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
      {post.thumbnail ? (
        <img src={post.thumbnail} alt="" className="w-full h-full object-cover" />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ background: post.thumbnailBg ?? '#f3f4f6' }}
        >
          <span className="text-3xl">{post.thumbnailEmoji ?? '📝'}</span>
        </div>
      )}
    </div>

    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
      <div>
        {post.tag && (
          <span
            className={`inline-block text-[10px] font-medium border px-1.5 py-0.5 rounded-md mb-1.5 ${
              TAG_COLORS[post.tag] ?? 'text-gray-400 bg-gray-50 border-gray-200'
            }`}
          >
            {post.tag}
          </span>
        )}
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-violet-600 transition-colors leading-snug">
          {post.title}
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
        <div className="flex items-center gap-1">
          {post.writerProfileImage ? (
            <img
              src={post.writerProfileImage}
              alt={post.writer}
              className="w-3.5 h-3.5 rounded-full object-cover"
            />
          ) : (
            <div className="w-3.5 h-3.5 rounded-full bg-linear-to-br from-violet-300 to-indigo-400 shrink-0" />
          )}
          <span className="font-medium text-gray-500">{post.writer}</span>
        </div>
        <span>{timeAgo(post.writedAt)}</span>
        <span className="flex items-center gap-0.5">
          <Eye size={11} />
          {post.views}
        </span>
      </div>
    </div>
  </div>
);

interface TechPostsOverViewProps {
  posts?: TechPostOverViewItem[];
  onPostClick?: (postUuid: string) => void;
}

export const TechPostsOverView = ({ posts = MOCK_POSTS, onPostClick }: TechPostsOverViewProps) => (
  <div className="grid grid-cols-2 gap-2.5">
    {posts.map((post) => (
      <PostCard key={post.postUuid} post={post} onClick={() => onPostClick?.(post.postUuid)} />
    ))}
  </div>
);

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600 * 1000).toISOString();

export const MOCK_POSTS: TechPostOverViewItem[] = [
  {
    postUuid: '1',
    title: "구글 크롬, 사용자 동의 없이 4GB AI 모델을 '조용히' 다운로드한다",
    writer: '길가다주웠어',
    writedAt: hoursAgo(10),
    views: 142,
    tag: 'Tech 뉴스',
    thumbnailEmoji: '✏️',
    thumbnailBg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
  },
  {
    postUuid: '2',
    title:
      '구직 활동이 더 위험해지고 있다, 링크드인 보고서 - 사기 목록과 진짜 목록을 구별하는 9가지 방법',
    writer: '길가다주웠어',
    writedAt: hoursAgo(10),
    views: 107,
    tag: 'Tech 뉴스',
    thumbnailEmoji: '👀',
    thumbnailBg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
    thumbnail: 'https://file.okky.kr/images/1778062184699.jpg',
  },
  {
    postUuid: '3',
    title: 'SVN 사용자(과거형)를 위한 Git 팁',
    writer: '컴포지트',
    writedAt: hoursAgo(11),
    views: 113,
    tag: '팁',
    thumbnailEmoji: '🔀',
    thumbnailBg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
  },
  {
    postUuid: '4',
    title: 'LightningChart JS 8.3 출시: 선버스트 차트, 멀티스레딩, 새로운 대시보드 공개',
    writer: 'LightningChart',
    writedAt: hoursAgo(13),
    views: 92,
    tag: '칼럼',
    thumbnailEmoji: '⚡',
    thumbnailBg: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  },
  {
    postUuid: '5',
    title: 'Claude Code 요금이 빨리 소진되는 이유: 프롬프트 캐시 이해하기',
    writer: 'evolink',
    writedAt: hoursAgo(14),
    views: 179,
    tag: 'Tech 뉴스',
    thumbnailEmoji: '⭐',
    thumbnailBg: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)',
  },
  {
    postUuid: '6',
    title: 'ChatGPT 기록은 당신이 몰랐던 성격 테스트임',
    writer: '길가다주웠어',
    writedAt: hoursAgo(16),
    views: 147,
    tag: 'Tech 뉴스',
    thumbnailEmoji: '👀',
    thumbnailBg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
  },
];
