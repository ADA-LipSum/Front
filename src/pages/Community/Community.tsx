import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommunityBanner,
  CommunityTabs,
  SearchFilterSection,
  StudyCard,
  Pagination,
  PopularTags,
  RecruitmentGuide,
} from '@/components/community';
import { fetchCommunityPosts } from '@/api/posts';
import { getTimeAgo } from '@/utils/time';
import type { CommunityPost, TabType } from '@/types/community';

const POSTS_PER_PAGE = 6;

export const Community = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [tagKeyword, setTagKeyword] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchCommunityPosts(0, 100);
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const popularTagsWithCount = useMemo(() => {
    const countMap = new Map<string, number>();
    posts.forEach((p) => {
      p.tags.forEach((tag) => {
        const key = tag.trim();
        if (key) countMap.set(key, (countMap.get(key) ?? 0) + 1);
      });
    });
    return Array.from(countMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let list = [...posts];
    if (activeTab === '모집중') list = list.filter((p) => p.status === 'recruiting');
    if (activeTab === '모집완료') list = list.filter((p) => p.status === 'closed');
    if (searchKeyword.trim()) {
      const q = searchKeyword.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q),
      );
    }
    if (tagKeyword.trim()) {
      const tag = tagKeyword.trim().toLowerCase().replace(/^#/, '');
      list = list.filter((p) =>
        p.tags.some((t) => t.toLowerCase().includes(tag)),
      );
    }
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [posts, activeTab, searchKeyword, tagKeyword]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setSearchKeyword('');
    setTagKeyword('');
    setCurrentPage(1);
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    setTagKeyword(tag);
    setCurrentPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <CommunityBanner />
      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-8">
        <main className="flex-1 min-w-0">
          <CommunityTabs activeTab={activeTab} onTabChange={handleTabChange} />
          <SearchFilterSection
            searchKeyword={searchKeyword}
            tagKeyword={tagKeyword}
            onSearchKeywordChange={setSearchKeyword}
            onTagKeywordChange={setTagKeyword}
            onSearch={handleSearch}
            onReset={handleReset}
            onWriteClick={() => navigate('/community/write')}
          />
          <section className="bg-white rounded border border-[#E0E0E0] p-4 shadow-sm">
            {loading ? (
              <div className="py-12 text-center text-[#9E9E9E]">불러오는 중...</div>
            ) : error ? (
              <div className="py-12 text-center text-red-500 text-sm">{error}</div>
            ) : paginatedPosts.length === 0 ? (
              <div className="py-12 text-center text-[#9E9E9E]">
                조건에 맞는 게시글이 없습니다.
              </div>
            ) : (
              paginatedPosts.map((post) => (
                <StudyCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  author={post.author}
                  timeAgo={getTimeAgo(post.createdAt)}
                  tags={post.tags}
                  avatarSrc={post.avatarSrc}
                />
              ))
            )}
          </section>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
        <aside className="w-64 shrink-0 flex flex-col gap-4">
          <PopularTags
            tagsWithCount={popularTagsWithCount}
            onTagClick={handleTagClick}
          />
          <RecruitmentGuide />
        </aside>
      </div>
    </div>
  );
};
