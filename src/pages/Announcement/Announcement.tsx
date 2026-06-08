import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  AnnouncementOverView,
  CATEGORY_COLORS,
  NOTICE_CATEGORY_LABEL,
} from '@/components/Page/announcement/AnnouncementOverView';
import { getNotices, getNoticeDetail } from '@/api/announcement';
import type { NoticeItem, NoticeCategory } from '@/api/announcement';

type KoreanCategory = '전체' | '행사' | '서비스' | '취업' | '기타';

const CATEGORY_TO_API: Record<KoreanCategory, NoticeCategory | undefined> = {
  전체: undefined,
  행사: 'EVENT',
  서비스: 'SERVICE',
  취업: 'EMPLOYMENT',
  기타: 'OTHER',
};

const CATEGORIES: { label: KoreanCategory; icon: string }[] = [
  { label: '전체', icon: '■' },
  { label: '행사', icon: '🎉' },
  { label: '서비스', icon: '🔧' },
  { label: '취업', icon: '💼' },
  { label: '기타', icon: '📋' },
];

const PAGE_SIZE = 8;

export const Announcement = () => {
  const [selectedCategory, setSelectedCategory] = useState<KoreanCategory>('전체');
  const [selectedPost, setSelectedPost] = useState<NoticeItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const apiCategory = CATEGORY_TO_API[selectedCategory];

  const { data: listData, isLoading: listLoading } = useQuery({
    queryKey: ['notices', currentPage, apiCategory, searchQuery],
    queryFn: () =>
      getNotices({
        page: currentPage - 1,
        size: PAGE_SIZE,
        category: apiCategory,
        query: searchQuery || undefined,
      }),
  });

  const posts = listData?.content ?? [];
  const totalPages = Math.max(1, listData?.totalPages ?? 1);

  const activePost = selectedPost ?? posts[0] ?? null;

  const { data: detail, isLoading: detailLoading } = useQuery({
    queryKey: ['notice-detail', activePost?.seq],
    queryFn: () => getNoticeDetail(activePost!.seq),
    enabled: !!activePost,
  });

  const handleCategoryChange = (cat: KoreanCategory) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setSearchQuery(inputValue);
    setCurrentPage(1);
  };

  const categoryLabel = detail?.noticeCategory
    ? (NOTICE_CATEGORY_LABEL[detail.noticeCategory] ?? '기타')
    : null;

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="max-w-350 mx-auto px-10 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">공지사항</h1>
            <p className="text-sm text-gray-500 mt-1">학교와 운영팀의 소식을 한눈에 확인하세요</p>
          </div>
          <div className="relative mt-1 flex items-center gap-2">
            <div className="relative">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400"
                size={15}
              />
              <input
                type="text"
                placeholder="공지 제목으로 검색"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-2 text-sm border border-blue-200 rounded-full bg-white focus:outline-none focus:border-blue-400 w-64 placeholder:text-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 text-sm bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors"
            >
              검색
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-5">
          {CATEGORIES.map((cat) => {
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
              </button>
            );
          })}
        </div>

        {/* Two-column layout */}
        <div className="flex gap-5 items-start">
          {/* Left: List + Pagination */}
          <div className="flex-1 min-w-0">
            {listLoading ? (
              <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-sm text-gray-400">
                불러오는 중...
              </div>
            ) : (
              <AnnouncementOverView
                posts={posts}
                selectedPost={activePost}
                onSelectPost={setSelectedPost}
              />
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1 mt-5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Right: Detail Panel */}
          {activePost && (
            <div className="w-95 shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
              {detailLoading ? (
                <div className="flex-1 flex items-center justify-center py-20 text-sm text-gray-400">
                  불러오는 중...
                </div>
              ) : detail ? (
                <>
                  {/* Post header */}
                  <div className="p-6 border-b border-gray-100">
                    {categoryLabel && (
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            CATEGORY_COLORS[categoryLabel] ?? 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {categoryLabel}
                        </span>
                      </div>
                    )}
                    <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                      {detail.title}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {detail.writer}
                      <span className="mx-1.5">·</span>
                      {detail.writedAt.slice(0, 10).replace(/-/g, '.')}
                      <span className="mx-1.5">·</span>
                    </p>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 min-h-50">
                    {detail.content ? (
                      detail.content.split('\n\n').map((para, i) => (
                        <p key={i} className="text-sm text-gray-700 leading-relaxed mb-3 last:mb-0">
                          {para}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">내용이 없습니다.</p>
                    )}
                  </div>

                  {/* Attachments */}
                  {detail.attachments.length > 0 && (
                    <div className="px-6 pt-4 pb-2 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 mb-2">
                        첨부파일 {detail.attachments.length}
                      </p>
                      {detail.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 mb-1.5 last:mb-0"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center shrink-0">
                              <span className="text-[9px] font-bold text-blue-600 leading-none">
                                {att.fileType.slice(0, 3).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-xs text-gray-700 truncate">{att.fileName}</span>
                          </div>
                          <a
                            href={att.fileUrl}
                            download={att.fileName}
                            className="ml-2 text-gray-400 hover:text-gray-700 shrink-0 transition-colors"
                          >
                            <Download size={14} />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
