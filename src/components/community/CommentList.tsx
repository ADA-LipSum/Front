import type { CommunityComment } from '@/types/community';

interface CommentListProps {
  comments: CommunityComment[];
  getTimeAgo: (iso: string) => string;
}

export const CommentList = ({ comments, getTimeAgo }: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <div className="py-8 text-center text-[#9E9E9E] text-sm border-t border-[#E0E0E0] mt-6">
        아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
      </div>
    );
  }

  return (
    <ul className="border-t border-[#E0E0E0] mt-6 divide-y divide-[#E0E0E0]">
      {comments.map((comment) => (
        <li key={comment.id} className="py-4 flex gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-[#8B7355] flex items-center justify-center text-white text-sm font-medium">
            {comment.author.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-black text-sm">{comment.author}</span>
              <span className="text-xs text-[#9E9E9E]">{getTimeAgo(comment.createdAt)}</span>
            </div>
            <p className="text-sm text-[#424242] whitespace-pre-wrap wrap-break-word">
              {comment.content}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};
