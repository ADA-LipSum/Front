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
  질문: 'text-blue-500 bg-blue-50 border-blue-100',
  기술: 'text-blue-500 bg-blue-50 border-blue-100',
  커리어: 'text-violet-500 bg-violet-50 border-violet-100',
  기타: 'text-gray-400 bg-gray-50 border-gray-200',
  팁: 'text-emerald-500 bg-emerald-50 border-emerald-100',
  칼럼: 'text-orange-500 bg-orange-50 border-orange-100',
};

const PostCard = ({ post, onClick }: { post: TechPostOverViewItem; onClick?: () => void }) => (
  <div
    onClick={onClick}
    className="flex flex-col cursor-pointer transition-all group bg-white rounded-sm shadow-sm overflow-hidden"
  >
    {/* Thumbnail */}
    <div className="w-full h-36 shrink-0 overflow-hidden flex items-center justify-center">
      {post.thumbnail ? (
        <img
          src={post.thumbnail}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ background: post.thumbnailBg ?? '#f3f4f6' }}
        >
          <span className="text-4xl">{post.thumbnailEmoji ?? '📝'}</span>
        </div>
      )}
    </div>

    {/* Content */}
    <div className="flex flex-col justify-between gap-2 p-3">
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
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
          {post.title}
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span className="font-medium text-gray-500">{post.writer}</span>
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
  <div className="grid grid-cols-3 gap-2.5">
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
    title: '대 AI시대 책 같은 건 정말 필요가 없을까?',
    writer: '김태호',
    writedAt: hoursAgo(10),
    views: 142,
    tag: '질문',
    thumbnail: 'https://i.ibb.co/WWPGgHFq/92cff33f-9dc0-4f40-bc6b-d9d7d2ee7a6f.jpg',
  },
  {
    postUuid: '2',
    title:
      '구직 활동이 더 위험해지고 있다, 링크드인 보고서 - 사기 목록과 진짜 목록을 구별하는 9가지 방법',
    writer: '길가다주웠어',
    writedAt: hoursAgo(10),
    views: 107,
    tag: '질문',
    thumbnail: 'https://file.okky.kr/images/1778062184699.jpg',
  },
  {
    postUuid: '3',
    title: '집 가고 싶은 개발자',
    writer: 'ㅇㅇ',
    writedAt: hoursAgo(11),
    views: 113,
    tag: '팁',
    thumbnail:
      'https://velog.velcdn.com/images/hjun-kr/post/05b7ffb7-d4a6-4d73-b63a-4cfab5b42745/image.jpg',
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
  {
    postUuid: '7',
    title:
      'Vite 6.0 정식 출시: 빌드 성능 40% 향상ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
    writer: 'FrontendNews',
    writedAt: hoursAgo(18),
    views: 203,
    tag: 'Tech 뉴스',
    thumbnailEmoji: '⚡',
    thumbnailBg: 'linear-gradient(135deg, #eff6ff 0%, #bfdbfe 100%)',
  },
  {
    postUuid: '8',
    title: 'TypeScript 5.5 새 기능 총정리',
    writer: 'TSExpert',
    writedAt: hoursAgo(20),
    views: 318,
    tag: '기술',
    thumbnailEmoji: '🔷',
    thumbnailBg: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)',
  },
  {
    postUuid: '9',
    title: '2025년 프론트엔드 개발자가 알아야 할 것들',
    writer: '길가다주웠어',
    writedAt: hoursAgo(22),
    views: 421,
    tag: '칼럼',
    thumbnailEmoji: '🗺️',
    thumbnailBg: 'linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)',
  },
  {
    postUuid: '10',
    title: 'React Server Components 실전 도입 후기',
    writer: 'RSC경험자',
    writedAt: hoursAgo(24),
    views: 275,
    tag: '기술',
    thumbnailEmoji: '⚛️',
    thumbnailBg: 'linear-gradient(135deg, #e0f2fe 0%, #7dd3fc 100%)',
  },
  {
    postUuid: '11',
    title: 'PostgreSQL vs MySQL 2025년 기준 비교',
    writer: 'DBAdmin',
    writedAt: hoursAgo(26),
    views: 189,
    tag: '기술',
    thumbnailEmoji: '🐘',
    thumbnailBg: 'linear-gradient(135deg, #f5f3ff 0%, #ddd6fe 100%)',
  },
  {
    postUuid: '12',
    title: '쿠버네티스 없이 배포하는 현실적인 방법들',
    writer: 'DevOpsKing',
    writedAt: hoursAgo(28),
    views: 234,
    tag: '팁',
    thumbnailEmoji: '🚢',
    thumbnailBg: 'linear-gradient(135deg, #f0f9ff 0%, #bae6fd 100%)',
  },
  {
    postUuid: '13',
    title: 'AI 코딩 도구 6개월 사용기: 진짜 생산성이 올랐나?',
    writer: 'AIPragmatist',
    writedAt: hoursAgo(30),
    views: 512,
    tag: '칼럼',
    thumbnailEmoji: '🤖',
    thumbnailBg: 'linear-gradient(135deg, #fafaf9 0%, #d6d3d1 100%)',
  },
  {
    postUuid: '14',
    title: '좋은 코드 리뷰 문화 만들기',
    writer: 'TeamPlayer',
    writedAt: hoursAgo(32),
    views: 167,
    tag: '팁',
    thumbnailEmoji: '👀',
    thumbnailBg: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
  },
  {
    postUuid: '15',
    title: 'Next.js App Router 마이그레이션 삽질기',
    writer: '마이그레이터',
    writedAt: hoursAgo(34),
    views: 298,
    tag: '기술',
    thumbnailEmoji: '▲',
    thumbnailBg: 'linear-gradient(135deg, #18181b 0%, #3f3f46 100%)',
  },
  {
    postUuid: '16',
    title: '오픈소스 기여 처음 시작하는 법',
    writer: 'OSContributor',
    writedAt: hoursAgo(36),
    views: 143,
    tag: '팁',
    thumbnailEmoji: '🌐',
    thumbnailBg: 'linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 100%)',
  },
  {
    postUuid: '17',
    title: '모노레포 도입 1년, 솔직한 회고',
    writer: 'MonorepoUser',
    writedAt: hoursAgo(38),
    views: 211,
    tag: '칼럼',
    thumbnailEmoji: '🏗️',
    thumbnailBg: 'linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)',
  },
  {
    postUuid: '18',
    title: 'Web Assembly로 이미지 처리 성능 10배 올리기',
    writer: 'WASMdev',
    writedAt: hoursAgo(40),
    views: 176,
    tag: '기술',
    thumbnailEmoji: '🦀',
    thumbnailBg: 'linear-gradient(135deg, #fff1f2 0%, #fecdd3 100%)',
  },
  {
    postUuid: '19',
    title: '시니어 개발자가 되기 위해 필요한 것들',
    writer: '10년차개발자',
    writedAt: hoursAgo(42),
    views: 389,
    tag: '커리어',
    thumbnailEmoji: '🎯',
    thumbnailBg: 'linear-gradient(135deg, #f5f3ff 0%, #c4b5fd 100%)',
  },
  {
    postUuid: '20',
    title: 'Tailwind CSS v4 완전 정복',
    writer: 'TailwindFan',
    writedAt: hoursAgo(44),
    views: 253,
    tag: '기술',
    thumbnailEmoji: '🎨',
    thumbnailBg: 'linear-gradient(135deg, #e0f2fe 0%, #38bdf8 100%)',
  },
  {
    postUuid: '21',
    title: '개발자 면접에서 자주 나오는 질문들',
    writer: '면접관',
    writedAt: hoursAgo(46),
    views: 321,
    tag: '팁',
    thumbnailEmoji: '❓',
    thumbnailBg: 'linear-gradient(135deg, #fef3c7 0%, #fdba74 100%)',
  },
];
