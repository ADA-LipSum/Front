import type { NoticeItem } from '@/api/announcement';

export type { NoticeItem };

export const NOTICE_CATEGORY_LABEL: Record<string, string> = {
  EVENT: '행사',
  SERVICE: '서비스',
  EMPLOYMENT: '취업',
  OTHER: '기타',
};

export const CATEGORY_COLORS: Record<string, string> = {
  행사: 'bg-pink-100 text-pink-600',
  서비스: 'bg-cyan-100 text-cyan-700',
  취업: 'bg-amber-100 text-amber-700',
  기타: 'bg-gray-100 text-gray-600',
};

interface AnnouncementOverViewProps {
  posts: NoticeItem[];
  selectedPost: NoticeItem | null;
  onSelectPost: (post: NoticeItem) => void;
}

export const AnnouncementOverView = ({
  posts,
  selectedPost,
  onSelectPost,
}: AnnouncementOverViewProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-[72px_88px_1fr_100px] text-xs text-gray-400 font-medium px-5 py-2.5 border-b border-gray-100 bg-gray-50/60">
        <span>번호</span>
        <span>분류</span>
        <span>제목</span>
        <span className="text-center">등록일</span>
      </div>

      {posts.length === 0 && (
        <div className="py-16 text-center text-sm text-gray-400">공지사항이 없습니다.</div>
      )}

      {posts.map((post) => {
        const isSelected = selectedPost?.id === post.id;
        const categoryLabel = post.noticeCategory
          ? (NOTICE_CATEGORY_LABEL[post.noticeCategory] ?? '기타')
          : '기타';
        const colorClass = CATEGORY_COLORS[categoryLabel] ?? 'bg-gray-100 text-gray-600';
        const dateStr = post.createdAt ? post.createdAt.slice(0, 10).replace(/-/g, '.') : '';

        return (
          <div
            key={post.id}
            onClick={() => onSelectPost(post)}
            className={`relative grid grid-cols-[72px_88px_1fr_100px] items-center px-5 py-3.5 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${
              isSelected ? 'bg-blue-50/40' : 'hover:bg-gray-50'
            }`}
          >
            {isSelected && (
              <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-gray-900 rounded-r-sm" />
            )}

            <div>
              {post.isPinned ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-500 border border-red-100">
                  고정
                </span>
              ) : (
                <span className="text-sm text-gray-500">{post.seq}</span>
              )}
            </div>

            <div>
              <span
                className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${colorClass}`}
              >
                {categoryLabel}
              </span>
            </div>

            <div className="min-w-0 pr-4">
              <span className="text-sm font-semibold text-gray-800 truncate block">
                {post.title}
              </span>
              <p className="text-xs text-gray-400 mt-0.5">{post.authorName}</p>
            </div>

            <div className="text-center">
              <span className="text-xs text-gray-500">{dateStr}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
