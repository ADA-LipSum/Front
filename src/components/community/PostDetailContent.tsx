import type { CommunityPost } from '@/types/community';

interface PostDetailContentProps {
  post: CommunityPost;
  getTimeAgo: (iso: string) => string;
}

export const PostDetailContent = ({ post, getTimeAgo }: PostDetailContentProps) => {
  return (
    <article className="bg-white rounded border border-[#E0E0E0] overflow-hidden shadow-sm">
      <div className="p-6 border-b border-[#E0E0E0]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#8B7355] flex items-center justify-center text-white text-lg font-medium shrink-0">
            {post.author.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-black mb-2">{post.title}</h1>
            <p className="text-sm text-[#757575] mb-3">
              {post.author} · {getTimeAgo(post.createdAt)}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded bg-[#E0E0E0] text-[#616161]"
                >
                  {tag}
                </span>
              ))}
              <span
                className={`px-2 py-1 text-xs rounded font-medium ${
                  post.status === 'recruiting'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-[#E0E0E0] text-[#616161]'
                }`}
              >
                {post.status === 'recruiting' ? '모집중' : '모집완료'}
              </span>
            </div>
            <div className="text-[#424242] whitespace-pre-wrap break-words leading-relaxed">
              {post.content}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
