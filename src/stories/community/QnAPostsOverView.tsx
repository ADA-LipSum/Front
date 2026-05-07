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
  기술: 'text-blue-500 bg-blue-50 border-blue-100',
  기타: 'text-gray-400 bg-gray-50 border-gray-200',
  잡담: 'text-gray-400 bg-gray-50 border-gray-200',
  질문: 'text-blue-500 bg-blue-50 border-blue-100',
  투표: 'text-yellow-500 bg-yellow-50 border-yellow-100',
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
    className="flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-all group"
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
    title: '저희 학교 이대로 괜찮은 걸까요?',
    writer: '김태호',
    writedAt: hoursAgo(10),
    views: 142,
    comments: 8,
    tag: '잡담',
  },
  {
    postUuid: '2',
    title: '저녁 메뉴 추천좀@@@@@@@',
    writer: '배고픈길고양',
    writedAt: hoursAgo(10),
    views: 107,
    comments: 3,
    tag: '질문',
  },
  {
    postUuid: '3',
    title: '경소마고에서 살아남는 법',
    writer: '컴포지트',
    writedAt: hoursAgo(11),
    views: 113,
    comments: 5,
    tag: '팁',
  },
  {
    postUuid: '4',
    title: '?',
    writer: '길가다주웠어',
    writedAt: hoursAgo(13),
    views: 92,
    comments: 1,
    tag: '질문',
  },
  {
    postUuid: '5',
    title: '개발자에게 가장 중요한 것은 무엇일까요?',
    writer: 'evolink',
    writedAt: hoursAgo(14),
    views: 179,
    comments: 12,
    tag: '질문',
  },
  {
    postUuid: '6',
    title: '학교에서 가장 인기있는 기술 스택?',
    writer: '길가다주웠어',
    writedAt: hoursAgo(16),
    views: 147,
    comments: 6,
    tag: '투표',
  },
  {
    postUuid: '7',
    title: '코딩 테스트 준비 어떻게 하셨나요?',
    writer: '준비중인사람',
    writedAt: hoursAgo(18),
    views: 201,
    comments: 14,
    tag: '질문',
  },
  {
    postUuid: '8',
    title: '취업 포트폴리오 프로젝트 추천',
    writer: '취준생A',
    writedAt: hoursAgo(20),
    views: 188,
    comments: 9,
    tag: '팁',
  },
  {
    postUuid: '9',
    title: '요즘 백엔드 취업 시장 어떤가요?',
    writer: '백엔드지망생',
    writedAt: hoursAgo(22),
    views: 234,
    comments: 17,
    tag: '잡담',
  },
  {
    postUuid: '10',
    title: '리액트 vs 뷰 어떤 걸 배워야 할까요',
    writer: '프론트왕초보',
    writedAt: hoursAgo(24),
    views: 163,
    comments: 11,
    tag: '질문',
  },
  {
    postUuid: '11',
    title: '알고리즘 스터디 같이 하실 분 구합니다',
    writer: '알고왕',
    writedAt: hoursAgo(26),
    views: 89,
    comments: 4,
    tag: '잡담',
  },
  {
    postUuid: '12',
    title: 'CS 공부 순서 추천해주세요',
    writer: '공부벌레',
    writedAt: hoursAgo(28),
    views: 175,
    comments: 8,
    tag: '질문',
  },
  {
    postUuid: '13',
    title: '개발자 사이드 프로젝트 수익 내보신 분?',
    writer: '사이드허슬러',
    writedAt: hoursAgo(30),
    views: 312,
    comments: 22,
    tag: '투표',
  },
  {
    postUuid: '14',
    title: '오늘 코딩하기 너무 싫다 ㅜㅜ',
    writer: '번아웃직전',
    writedAt: hoursAgo(32),
    views: 95,
    comments: 6,
    tag: '잡담',
  },
  {
    postUuid: '15',
    title: 'Git 브랜치 전략 어떻게 쓰시나요?',
    writer: 'GitMaster',
    writedAt: hoursAgo(34),
    views: 144,
    comments: 7,
    tag: '질문',
  },
  {
    postUuid: '16',
    title: '스타트업 vs 대기업 어디가 나을까요?',
    writer: '진로고민중',
    writedAt: hoursAgo(36),
    views: 267,
    comments: 19,
    tag: '투표',
  },
  {
    postUuid: '17',
    title: 'TypeScript 억지로 배워야 할까요?',
    writer: 'JSonly',
    writedAt: hoursAgo(38),
    views: 198,
    comments: 13,
    tag: '질문',
  },
  {
    postUuid: '18',
    title: '개발자 번아웃 극복 방법 공유해요',
    writer: '회복중인개발자',
    writedAt: hoursAgo(40),
    views: 223,
    comments: 16,
    tag: '팁',
  },
  {
    postUuid: '19',
    title: '새벽 코딩 vs 아침 코딩 뭐가 나은가요?',
    writer: '올빼미개발자',
    writedAt: hoursAgo(42),
    views: 134,
    comments: 10,
    tag: '잡담',
  },
  {
    postUuid: '20',
    title: '주니어 개발자가 읽어야 할 책 추천',
    writer: '책덕후',
    writedAt: hoursAgo(44),
    views: 289,
    comments: 21,
    tag: '팁',
  },
];
