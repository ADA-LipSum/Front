import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBookmarks, type BookmarkPost } from '@/api/bookmark';
import { Bookmark, Eye, MessageCircle, Heart } from 'lucide-react';
import Avatar from '@/components/global/Avatar';

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `약 ${diff}초 전`;
  if (diff < 3600) return `약 ${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `약 ${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

const BookmarkCard = ({ post, onClick }: { post: BookmarkPost; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="flex items-start gap-3 px-4 py-4 cursor-pointer bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-100 transition-all duration-200"
  >
    {post.writerProfileImage ? (
      <Avatar name={post.writer} src={post.writerProfileImage} size="md" className="shrink-0 mt-0.5" />
    ) : (
      <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold shrink-0 mt-0.5">
        {post.writer.charAt(0)}
      </div>
    )}

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
        {post.tag && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500 border border-indigo-100">
            {post.tag}
          </span>
        )}
      </div>

      <p className="text-sm font-semibold text-gray-800 truncate leading-snug mb-1">
        {post.title}
      </p>

      <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
        <span className="font-medium text-gray-500">{post.writer}</span>
        <span>·</span>
        <span>{timeAgo(post.writedAt)}</span>
        <span className="ml-auto flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {post.views}
          </span>
          <span className="flex items-center gap-1">
            <Heart size={12} />
            {post.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={12} />
            {post.comments}
          </span>
        </span>
      </div>
    </div>

    {post.thumbnailImage && (
      <img
        src={post.thumbnailImage}
        alt=""
        className="w-16 h-16 rounded-lg object-cover shrink-0 border border-gray-100"
      />
    )}
  </div>
);

const SkeletonCard = () => (
  <div className="flex items-start gap-3 px-4 py-4 bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse">
    <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0 mt-0.5" />
    <div className="flex-1 min-w-0 space-y-2 pt-0.5">
      <div className="h-3 bg-gray-200 rounded-full w-20" />
      <div className="h-4 bg-gray-200 rounded-full w-4/5" />
      <div className="h-3 bg-gray-200 rounded-full w-2/5" />
    </div>
  </div>
);

export const Bookmarks = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => getBookmarks(0, 50),
  });

  const posts = data?.content ?? [];

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-6">
          <Bookmark size={20} className="text-indigo-500" />
          <h1 className="text-xl font-bold text-gray-800">내 북마크</h1>
          {data && (
            <span className="ml-1 text-sm text-gray-400">{data.totalElements}개</span>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <Bookmark size={36} className="text-gray-200" />
            <p className="text-sm font-medium">북마크한 게시글이 없어요</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <BookmarkCard
                key={post.postUuid}
                post={post}
                onClick={() => navigate(`/article/${post.seq}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
