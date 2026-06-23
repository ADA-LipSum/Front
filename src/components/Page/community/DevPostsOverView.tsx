import Avatar from '@/components/global/Avatar';
import { Eye, MessageCircle } from 'lucide-react';

export interface DevPostOverViewItem {
  seq: number;
  postUuid?: string;
  title: string;
  writer: string;
  writerProfileImage?: string;
  writedAt: string;
  views: number;
  comments?: number;
  tag?: string;
  techTags?: string[];
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `약 ${diff}초 전`;
  if (diff < 3600) return `약 ${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `약 ${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

const TAG_COLORS: Record<string, string> = {
  기술: 'text-blue-500 bg-blue-50 border-blue-100',
  기타: 'text-gray-400 bg-gray-50 border-gray-200',
  잡담: 'text-gray-400 bg-gray-50 border-gray-200',
  질문: 'text-blue-500 bg-blue-50 border-blue-100',
  투표: 'text-yellow-500 bg-yellow-50 border-yellow-100',
  자료공유: 'text-green-500 bg-green-50 border-green-100',
};

const PostCard = ({
  post,
  onClick,
}: {
  post: DevPostOverViewItem;
  onClick?: () => void;
  rank: number;
}) => (
  <div
    onClick={onClick}
    className="flex items-start gap-3 px-4 py-4 cursor-pointer group bg-white rounded-sm border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-blue-100 transition-all duration-200"
  >
    {post.writerProfileImage ? (
      <Avatar
        name={post.writer}
        src={post.writerProfileImage}
        size="md"
        className="rounded-sm bg-gray-100 shrink-0 object-cover mt-0.5"
      />
    ) : (
      <div className="w-9 h-9 rounded-sm bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0 mt-0.5">
        {post.writer.charAt(0)}
      </div>
    )}

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
        {post.tag && (
          <span
            className={`text-[10px] font-semibold border px-1.5 py-0.5 rounded-sm ${
              TAG_COLORS[post.tag] ?? 'text-gray-400 bg-gray-50 border-gray-200'
            }`}
          >
            {post.tag}
          </span>
        )}
        {post.techTags?.map((t) => (
          <span
            key={t}
            className="text-[10px] font-semibold border px-1.5 py-0.5 rounded-sm text-violet-500 bg-violet-50 border-violet-100"
          >
            {t}
          </span>
        ))}
      </div>
      <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
        {post.title}
      </p>
      <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
        <span className="font-medium text-gray-500">{post.writer}</span>
        <span>{timeAgo(post.writedAt)}</span>
        <span className="flex items-center gap-0.5 ml-auto">
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

interface DevPostsOverViewProps {
  posts?: DevPostOverViewItem[];
  onPostClick?: (seq: number) => void;
}

export const DevPostsOverView = ({ posts = [], onPostClick }: DevPostsOverViewProps) => {
  if (posts.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-400 text-sm">게시글이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {posts.map((post, i) => (
        <PostCard key={post.seq} post={post} rank={i + 1} onClick={() => onPostClick?.(post.seq)} />
      ))}
    </div>
  );
};
