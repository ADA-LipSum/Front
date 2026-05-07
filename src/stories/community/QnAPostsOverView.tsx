import { Eye, MessageCircle } from 'lucide-react';

export interface QnAPostOverViewItem {
  postUuid: string;
  title: string;
  writer: string;
  writerProfileImage?: string;
  writedAt: string;
  views: number;
  comments?: number;
  tag?: string;
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

const PostCard = ({
  post,
  onClick,
  rank,
}: {
  post: QnAPostOverViewItem;
  onClick?: () => void;
  rank: number;
}) => (
  <div
    onClick={onClick}
    className="flex items-center gap-4 px-4 py-3.5 bg-white rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-sm cursor-pointer transition-all group"
  >
    <img
      src="https://avatars.githubusercontent.com/u/108007761?v=4"
      alt=""
      className="w-10 h-10 rounded-full bg-gray-100 shrink-0"
    />

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
        {post.tag && (
          <span
            className={`text-[10px] font-medium border px-1.5 py-0.5 rounded-md ${
              TAG_COLORS[post.tag] ?? 'text-gray-400 bg-gray-50 border-gray-200'
            }`}
          >
            {post.tag}
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors">
        {post.title}
      </p>
      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
        <div className="flex items-center gap-1">
          <span>{post.writer}</span>
        </div>
        <span>{timeAgo(post.writedAt)}</span>
        <span className="flex items-center gap-0.5">
          <Eye size={11} />
          {post.views}
        </span>
        {post.comments !== undefined && (
          <span className="flex items-center gap-0.5">
            <MessageCircle size={11} />
            {post.comments}
          </span>
        )}
      </div>
    </div>
  </div>
);

interface QnAPostsOverViewProps {
  posts?: QnAPostOverViewItem[];
  onPostClick?: (postUuid: string) => void;
}

export const QnAPostsOverView = ({ posts = MOCK_POSTS, onPostClick }: QnAPostsOverViewProps) => (
  <div className="space-y-2">
    {posts.map((post, i) => (
      <PostCard
        key={post.postUuid}
        post={post}
        rank={i + 1}
        onClick={() => onPostClick?.(post.postUuid)}
      />
    ))}
  </div>
);

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600 * 1000).toISOString();

export const MOCK_POSTS: QnAPostOverViewItem[] = [
  {
    postUuid: '1',
    title: '저희 학교 이대로 괜찮은 걸까요? 요즘 학교에서 일어나는 일들',
    writer: '길가다주웠어',
    writedAt: hoursAgo(10),
    views: 142,
    comments: 8,
    tag: 'Tech 뉴스',
  },
  {
    postUuid: '2',
    title:
      '구직 활동이 더 위험해지고 있다, 링크드인 보고서 - 사기 목록과 진짜 목록을 구별하는 9가지 방법',
    writer: '길가다주웠어',
    writedAt: hoursAgo(10),
    views: 107,
    comments: 3,
    tag: 'Tech 뉴스',
  },
  {
    postUuid: '3',
    title: 'SVN 사용자(과거형)를 위한 Git 팁',
    writer: '컴포지트',
    writedAt: hoursAgo(11),
    views: 113,
    comments: 5,
    tag: '팁',
  },
  {
    postUuid: '4',
    title: 'LightningChart JS 8.3 출시: 선버스트 차트, 멀티스레딩, 새로운 대시보드 공개',
    writer: 'LightningChart',
    writedAt: hoursAgo(13),
    views: 92,
    comments: 1,
    tag: '칼럼',
  },
  {
    postUuid: '5',
    title: 'Claude Code 요금이 빨리 소진되는 이유: 프롬프트 캐시 이해하기',
    writer: 'evolink',
    writedAt: hoursAgo(14),
    views: 179,
    comments: 12,
    tag: 'Tech 뉴스',
  },
  {
    postUuid: '6',
    title: 'ChatGPT 기록은 당신이 몰랐던 성격 테스트임',
    writer: '길가다주웠어',
    writedAt: hoursAgo(16),
    views: 147,
    comments: 6,
    tag: 'Tech 뉴스',
  },
];
