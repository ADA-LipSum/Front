import { useState, useMemo } from 'react';
import { Bookmark, ChevronLeft, ChevronRight, Download, Search, Share2 } from 'lucide-react';
import {
  AnnouncementOverView,
  CATEGORY_COLORS,
  MOCK_POSTS,
  type AnnouncementPost,
} from '@/components/Page/announcement/AnnouncementOverView';

const CATEGORIES = [
  { label: '전체', icon: '■' },
  { label: '학사', icon: '🎓' },
  { label: '행사', icon: '🎉' },
  { label: '생활관', icon: '🏠' },
  { label: '장학', icon: '🔥' },
  { label: '취업', icon: '💼' },
  { label: '서비스', icon: '🔧' },
];

const ITEMS_PER_PAGE = 8;

export const Announcement = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedPost, setSelectedPost] = useState<AnnouncementPost>(MOCK_POSTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const pinnedPosts = MOCK_POSTS.filter(p => p.isPinned);
  const regularPosts = MOCK_POSTS.filter(p => !p.isPinned);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { '전체': MOCK_POSTS.length };
    MOCK_POSTS.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  const matchesFilter = (p: AnnouncementPost) =>
    (selectedCategory === '전체' || p.category === selectedCategory) &&
    (!searchQuery || p.title.includes(searchQuery));

  const filteredPinned = useMemo(() => pinnedPosts.filter(matchesFilter), [selectedCategory, searchQuery]);
  const filteredRegular = useMemo(() => regularPosts.filter(matchesFilter), [selectedCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRegular.length / ITEMS_PER_PAGE));
  const pagedRegular = filteredRegular.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const displayedPosts = [...filteredPinned, ...pagedRegular];

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="max-w-350 mx-auto px-10 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">공지사항</h1>
            <p className="text-sm text-gray-500 mt-1">학교와 운영팀의 소식을 한눈에 확인하세요</p>
          </div>
          <div className="relative mt-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" size={15} />
            <input
              type="text"
              placeholder="공지 제목으로 검색"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm border border-blue-200 rounded-full bg-white focus:outline-none focus:border-blue-400 w-64 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-5">
          {CATEGORIES.map(cat => {
            const count = categoryCounts[cat.label] ?? 0;
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => handleCategoryChange(cat.label)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <span className="text-xs leading-none">{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={isSelected ? 'text-gray-400' : 'text-gray-400'}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Two-column layout */}
        <div className="flex gap-5 items-start">
          {/* Left: List + Pagination */}
          <div className="flex-1 min-w-0">
            <AnnouncementOverView
              posts={displayedPosts}
              selectedPost={selectedPost}
              onSelectPost={setSelectedPost}
            />

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1 mt-5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Right: Detail Panel */}
          <div className="w-95 shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
            {/* Post header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${CATEGORY_COLORS[selectedPost.category]}`}
                >
                  {selectedPost.category}
                </span>
                {selectedPost.isHot && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white leading-none">
                    HOT
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                {selectedPost.title}
              </h2>
              <p className="text-xs text-gray-400">
                {selectedPost.author}
                <span className="mx-1.5">·</span>
                {selectedPost.createdAt}
                <span className="mx-1.5">·</span>
                조회 {selectedPost.viewCount.toLocaleString()}
              </p>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 min-h-50">
              {selectedPost.content.split('\n\n').map((para, i) => (
                <p key={i} className="text-sm text-gray-700 leading-relaxed mb-3 last:mb-0">
                  {para}
                </p>
              ))}
            </div>

            {/* Attachments */}
            {selectedPost.attachments.length > 0 && (
              <div className="px-6 pt-4 pb-2 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  첨부파일 {selectedPost.attachments.length}
                </p>
                {selectedPost.attachments.map((att, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 mb-1.5 last:mb-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-bold text-blue-600 leading-none">PDF</span>
                      </div>
                      <span className="text-xs text-gray-700 truncate">{att.name}</span>
                    </div>
                    <button className="ml-2 text-gray-400 hover:text-gray-700 shrink-0 transition-colors">
                      <Download size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom buttons */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 mt-auto">
              <button className="px-4 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                목록
              </button>
              <div className="flex items-center gap-0.5">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-50 transition-colors">
                  <Bookmark size={14} />
                  저장
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 size={14} />
                  공유
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
