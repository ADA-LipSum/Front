import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPosts } from '@/api/posts';
import { TechPostsOverView, MOCK_POSTS } from '@/stories/community/TechPostsOverView';
import { HeadSection } from '@/stories/community/HeadSection';
import { QnAPostsOverView } from '@/stories/community/QnAPostsOverView';
import { FilterBar } from '@/stories/community/FilterBar';

const PAGE_SIZE = 10;

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

const POPULAR_TAGS = ['Tech 뉴스', '팁', '칼럼', '커리어', '기술', '기타'];

const TAG_BADGE_COLORS: Record<string, string> = {
  'Tech 뉴스': 'bg-blue-50 text-blue-600 hover:bg-blue-100',
  팁: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
  칼럼: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
  커리어: 'bg-violet-50 text-violet-600 hover:bg-violet-100',
  기술: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100',
  기타: 'bg-gray-100 text-gray-500 hover:bg-gray-200',
};

export const Community = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ── Search & Write ── */}
        <HeadSection className="mb-5 w-full" />

        <div className="flex gap-6 items-start">
          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {/* Filter */}
            <FilterBar className="mb-6" />

            {/* QnA Section */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-500 rounded-full" />
                  <h2 className="text-base font-bold text-gray-900">최신 글</h2>
                </div>
                <button className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors">
                  더보기 →
                </button>
              </div>
              <QnAPostsOverView
                posts={[
                  {
                    postUuid: '1',
                    tag: 'Tech 뉴스',
                    title: '저희 학교 이대로 괜찮은건가 싶네요..',
                    views: 142,
                    writedAt: '2026-05-06T15:59:50.574Z',
                    writer: '경소고코딩1짱',
                  },
                  {
                    postUuid: '2',
                    tag: 'Tech 뉴스',
                    title: '시험날 외출 가능한가요?',
                    views: 107,
                    writedAt: '2026-05-06T15:59:50.574Z',
                    writer: '홍길동',
                  },
                  {
                    postUuid: '3',
                    tag: '팁',
                    title: 'SVN 사용자(과거형)를 위한 Git 팁',
                    views: 113,
                    writedAt: '2026-05-06T14:59:50.574Z',
                    writer: '컴포지트',
                  },
                  {
                    postUuid: '4',
                    tag: '칼럼',
                    title:
                      'LightningChart JS 8.3 출시: 선버스트 차트, 멀티스레딩, 새로운 대시보드 공개',
                    views: 92,
                    writedAt: '2026-05-06T12:59:50.574Z',
                    writer: 'LightningChart',
                  },
                  {
                    postUuid: '5',
                    tag: 'Tech 뉴스',
                    title: 'Claude Code 요금이 빨리 소진되는 이유: 프롬프트 캐시 이해하기',
                    views: 179,
                    writedAt: '2026-05-06T11:59:50.574Z',
                    writer: 'evolink',
                  },
                  {
                    postUuid: '6',
                    tag: 'Tech 뉴스',
                    title: 'ChatGPT 기록은 당신이 몰랐던 성격 테스트임',
                    views: 147,
                    writedAt: '2026-05-06T09:59:50.574Z',
                    writer: '길가다주웠어',
                  },
                ]}
              />
            </section>

            {/* Tech Posts Section */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-violet-500 rounded-full" />
                  <h2 className="text-base font-bold text-gray-900">최신 기술글</h2>
                </div>
                <button className="text-xs text-violet-500 hover:text-violet-600 font-medium transition-colors">
                  더보기 →
                </button>
              </div>
              <TechPostsOverView
                posts={MOCK_POSTS}
                onPostClick={(uuid) => navigate(`/community/${uuid}`)}
              />
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-1">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  className="w-9 h-9 rounded-lg text-gray-400 hover:bg-white hover:border hover:border-gray-200 disabled:opacity-30 transition-all text-lg"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-9 h-9 text-sm rounded-lg font-medium transition-all ${
                      currentPage === i
                        ? 'bg-blue-500 text-white shadow-sm shadow-blue-200'
                        : 'text-gray-500 hover:bg-white hover:border hover:border-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages - 1}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  className="w-9 h-9 rounded-lg text-gray-400 hover:bg-white hover:border hover:border-gray-200 disabled:opacity-30 transition-all text-lg"
                >
                  ›
                </button>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="w-60 shrink-0 space-y-4 sticky top-8">
            {/* CTA */}
            <div className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white">
              <h3 className="font-bold text-sm mb-1">커뮤니티에 참여하세요</h3>
              <p className="text-blue-100 text-xs mb-4 leading-relaxed">
                질문하고, 공유하고,
                <br />
                함께 성장해요
              </p>
              <button className="bg-white text-blue-600 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors w-full">
                글 작성하기
              </button>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
                인기 태그
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_TAGS.map((tag) => (
                  <button
                    key={tag}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                      TAG_BADGE_COLORS[tag] ?? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
                커뮤니티 현황
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">전체 게시글</span>
                  <span className="text-xs font-bold text-gray-800">1,247</span>
                </div>
                <div className="h-px bg-gray-50" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">오늘 새 글</span>
                  <span className="text-xs font-bold text-emerald-500">+23</span>
                </div>
                <div className="h-px bg-gray-50" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">활성 멤버</span>
                  <span className="text-xs font-bold text-blue-500">342</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
