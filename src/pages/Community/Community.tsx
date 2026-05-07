import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPosts } from '@/api/posts';
import {
  TechPostsOverView,
  MOCK_POSTS as TECH_MOCK_POSTS,
} from '@/stories/community/TechPostsOverView';
import { HeadSection } from '@/stories/community/HeadSection';
import {
  QnAPostsOverView,
  MOCK_POSTS as QNA_MOCK_POSTS,
} from '@/stories/community/QnAPostsOverView';
import { FilterBar } from '@/stories/community/FilterBar';

const PAGE_SIZE = 10;
const QNA_PAGE_SIZE = 5;
const TECH_PAGE_SIZE = 4;

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
    <div className="flex justify-center items-center mt-4 gap-1">
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

interface Post {
  postUuid: string;
  title: string;
  writer: string;
  writerProfileImage?: string;
  writedAt: string;
  likes: number;
  views: number;
  comments: number;
  isDev: boolean;
  devTags?: string | string[];
  tag?: string;
}

export const Community = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [qnaPage, setQnaPage] = useState(0);
  const [techPage, setTechPage] = useState(0);

  const qnaTotalPages = Math.ceil(QNA_MOCK_POSTS.length / QNA_PAGE_SIZE);
  const techTotalPages = Math.ceil(TECH_MOCK_POSTS.length / TECH_PAGE_SIZE);

  const pagedQnaPosts = QNA_MOCK_POSTS.slice(
    qnaPage * QNA_PAGE_SIZE,
    (qnaPage + 1) * QNA_PAGE_SIZE,
  );
  const pagedTechPosts = TECH_MOCK_POSTS.slice(
    techPage * TECH_PAGE_SIZE,
    (techPage + 1) * TECH_PAGE_SIZE,
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchPosts(currentPage, PAGE_SIZE);
        if (data && typeof data === 'object' && 'content' in data) {
          setPosts(data.content);
          setTotalPages(data.totalPages ?? 1);
        } else if (Array.isArray(data)) {
          setPosts(data);
          setTotalPages(1);
        }
      } catch {
        /* no-op */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentPage]);

  void posts;
  void loading;
  void totalPages;
  void setCurrentPage;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6 items-start">
          {/* ── Sidebar ── */}
          <aside className="w-60 shrink-0 space-y-4 sticky top-8">
            {/* 일일 미션 */}
            <div className="w-full aspect-square min-h-80 max-h-80 bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-2 overflow-hidden">
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                Daily Mission
              </p>
              <p className="text-[10px] text-gray-300">300 × 300</p>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {/* Search & Write */}
            <HeadSection className="mb-5" />

            {/* Filter */}
            <FilterBar className="mb-6" />

            {/* QnA Section */}
            <section className="mb-8">
              <QnAPostsOverView
                posts={pagedQnaPosts}
                onPostClick={(uuid) => navigate(`/community/${uuid}`)}
              />
              <Pagination
                currentPage={qnaPage}
                totalPages={qnaTotalPages}
                onPageChange={setQnaPage}
                color="blue"
              />
            </section>

            {/* Tech Posts Section */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-2xl font-bold text-gray-900">최신 블로그</h2>
              </div>
              <TechPostsOverView
                posts={pagedTechPosts}
                onPostClick={(uuid) => navigate(`/community/${uuid}`)}
              />
              <Pagination
                currentPage={techPage}
                totalPages={techTotalPages}
                onPageChange={setTechPage}
                color="violet"
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
