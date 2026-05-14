import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TechPostsOverView,
  MOCK_POSTS as TECH_MOCK_POSTS,
} from '@/components/Page/community/TechPostsOverView';
import { HeadSection } from '@/components/Page/community/HeadSection';
import { QnAPostsOverView } from '@/components/Page/community/QnAPostsOverView';
import type { QnAPostOverViewItem } from '@/components/Page/community/QnAPostsOverView';
import { FilterBar } from '@/components/Page/community/FilterBar';
import { getCommunityPosts } from '@/api/community';
import type { getCommunityPostsParams } from '@/api/community';
import AnnounceBanner from '@/components/Page/community/AnnounceBanner';

const QNA_PAGE_SIZE = 4;

const CATEGORY_MAP: Record<string, getCommunityPostsParams['category']> = {
  전체: undefined,
  기술: 'TECH',
  밈: 'MEME',
  '프로젝트 자랑': 'PROJECT_SHOWCASE',
  기타: 'CHAT',
};

const CATEGORY_LABEL: Record<string, string> = {
  CHAT: '잡담',
  MEME: '밈',
  PROJECT_SHOWCASE: '프로젝트 자랑',
  TECH: '기술',
};

const TECH_SUB_TAG_LABEL: Record<string, string> = {
  QUESTION: '질문',
  CHAT: '잡담',
  TIP: '팁',
  POLL: '투표',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDisplayTag(item: any): string {
  if (item.communityCategory === 'TECH' && item.techSubTag) {
    return TECH_SUB_TAG_LABEL[item.techSubTag] ?? item.techSubTag;
  }
  return CATEGORY_LABEL[item.communityCategory] ?? '';
}

const getPageWindow = (current: number, total: number): (number | 'ellipsis')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const pages: (number | 'ellipsis')[] = [0];
  if (current > 2) pages.push('ellipsis');
  for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) pages.push(i);
  if (current < total - 3) pages.push('ellipsis');
  pages.push(total - 1);
  return pages;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  color = 'blue',
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  color?: 'blue' | 'violet';
}) => {
  if (totalPages <= 1) return null;
  const activeClass =
    color === 'violet'
      ? 'bg-violet-500 text-white shadow-sm shadow-violet-200'
      : 'bg-blue-500 text-white shadow-sm shadow-blue-200';
  const navClass =
    'px-3 h-8 rounded-lg text-sm font-medium text-gray-500 hover:bg-white hover:border hover:border-gray-200 disabled:opacity-30 transition-all';
  const pages = getPageWindow(currentPage, totalPages);
  return (
    <div className="flex justify-center items-center mt-5 gap-1">
      <button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className={navClass}
      >
        이전
      </button>
      {pages.map((page, idx) =>
        page === 'ellipsis' ? (
          <span
            key={`e${idx}`}
            className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm select-none"
          >
            ···
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 text-sm rounded-lg font-medium transition-all ${
              currentPage === page
                ? activeClass
                : 'text-gray-500 hover:bg-white hover:border hover:border-gray-200'
            }`}
          >
            {page + 1}
          </button>
        ),
      )}
      <button
        disabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className={navClass}
      >
        다음
      </button>
    </div>
  );
};

const PostSkeleton = () => (
  <div className="flex items-start gap-3 px-4 py-4 bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse">
    <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0 mt-0.5" />
    <div className="flex-1 min-w-0 space-y-2 pt-0.5">
      <div className="h-3 bg-gray-200 rounded-full w-14" />
      <div className="h-4 bg-gray-200 rounded-full w-4/5" />
      <div className="h-3 bg-gray-200 rounded-full w-2/5" />
    </div>
  </div>
);

export const Community = () => {
  const navigate = useNavigate();
  const [qnaPosts, setQnaPosts] = useState<QnAPostOverViewItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [qnaPage, setQnaPage] = useState(0);
  const [qnaTotalPages, setQnaTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const params: getCommunityPostsParams = { page: qnaPage, size: QNA_PAGE_SIZE };
        const category = CATEGORY_MAP[activeFilter];
        if (category) params.category = category;
        if (searchQuery) params.query = searchQuery;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await getCommunityPosts(params);
        const res = data as unknown as { content?: any[]; totalPages?: number };
        const content: any[] = res.content ?? [];

        setQnaPosts(
          content.map((item) => ({
            seq: item.seq,
            title: item.title,
            writer: item.writer,
            writerProfileImage: item.writerProfileImage,
            writedAt: item.writedAt,
            views: item.views,
            comments: item.comments,
            tag: getDisplayTag(item),
            techTags: item.techTags?.length ? item.techTags : undefined,
          })),
        );

        setQnaTotalPages(res.totalPages ?? 1);
      } catch {
        /* no-op */
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [activeFilter, searchQuery, qnaPage]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setQnaPage(0);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6 items-start">
          <div className="flex-1 min-w-0">
            <AnnounceBanner />

            <HeadSection className="mb-5" onSearch={setSearchQuery} />

            <FilterBar
              className="mb-6"
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />

            {/* QnA Section */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-5 rounded-full bg-blue-500 inline-block" />
                <h3 className="text-lg font-bold text-gray-900">커뮤니티 글</h3>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 gap-3">
                  {Array.from({ length: QNA_PAGE_SIZE }).map((_, i) => (
                    <PostSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <QnAPostsOverView
                  posts={qnaPosts}
                  onPostClick={(seq) => navigate(`/article/${seq}`)}
                />
              )}

              <Pagination
                currentPage={qnaPage}
                totalPages={qnaTotalPages}
                onPageChange={setQnaPage}
                color="blue"
              />
            </section>

            {/* Tech Blog Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-5 rounded-full bg-violet-500 inline-block" />
                <h3 className="text-lg font-bold text-gray-900">최신 블로그</h3>
              </div>
              <TechPostsOverView
                posts={TECH_MOCK_POSTS.slice(0, 3)}
                onPostClick={(uuid) => navigate(`/${uuid}`)}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
