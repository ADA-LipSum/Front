import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpDown,
  Flame,
  Image,
  Video,
  AlignLeft,
  HelpCircle,
  FolderOpen,
  Share2,
  Laugh,
} from 'lucide-react';
import {
  ShareFeedOverView,
  type ShareFeedItem,
} from '@/components/Page/community/ShareFeedOverView';
import { DevPostsOverView } from '@/components/Page/community/DevPostsOverView';
import type { DevPostOverViewItem } from '@/components/Page/community/DevPostsOverView';
import { RightWidget } from '@/components/Page/community/RightWidget';
import { LeftWidget } from '@/components/Page/community/LeftWidget';
import AnnounceBanner from '@/components/Page/community/AnnounceBanner';
import { getCommunityPosts, getDevCommunityPosts } from '@/api/community';
import { useQuery } from '@tanstack/react-query';

type CommunityTab = 'general' | 'dev' | 'study-group';
type SortOrder = 'latest' | 'popular';
type MediaFilter = 'all' | 'photo' | 'video' | 'text';
type DevPostType = 'ALL' | 'QUESTION' | 'PROJECT' | 'MEME' | 'RESOURCE_SHARING';

const TABS: { id: CommunityTab; label: string; icon: string }[] = [
  {
    id: 'general',
    label: '일반',
    icon: 'https://images.woopicx.com/assets/a9a7a4ec-6cd2-4f22-adbe-732d78480faa/main.png',
  },
  {
    id: 'dev',
    label: '개발',
    icon: 'https://static.vecteezy.com/system/resources/thumbnails/047/247/445/small/3d-code-icon-symbols-of-programming-illustration-png.png',
  },
];

const SORT_OPTIONS: { id: SortOrder; label: string; icon: typeof ArrowUpDown }[] = [
  { id: 'latest', label: '최신순', icon: ArrowUpDown },
  { id: 'popular', label: '인기순', icon: Flame },
];

const MEDIA_OPTIONS: { id: MediaFilter; label: string; icon: typeof Image }[] = [
  { id: 'all', label: '전체', icon: AlignLeft },
  { id: 'photo', label: '사진', icon: Image },
  { id: 'video', label: '영상', icon: Video },
  { id: 'text', label: '텍스트', icon: AlignLeft },
];

const DEV_POST_TYPE_OPTIONS: { id: DevPostType; label: string; icon: typeof AlignLeft }[] = [
  { id: 'ALL', label: '전체', icon: AlignLeft },
  { id: 'QUESTION', label: '질문', icon: HelpCircle },
  { id: 'PROJECT', label: '프로젝트', icon: FolderOpen },
  { id: 'MEME', label: '밈', icon: Laugh },
  { id: 'RESOURCE_SHARING', label: '자료공유', icon: Share2 },
];

const TECH_SUB_TAG_LABEL: Record<string, string> = {
  QUESTION: '질문',
  CHAT: '잡담',
  TIP: '팁',
  POLL: '투표',
  RESOURCE_SHARING: '자료공유',
};

const PostSkeleton = () => (
  <div className="flex gap-3 px-4 py-3 border-b border-gray-100 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
    <div className="flex-1 min-w-0 space-y-2 pt-1">
      <div className="flex gap-2">
        <div className="h-3 bg-gray-200 rounded-full w-20" />
        <div className="h-3 bg-gray-200 rounded-full w-14" />
      </div>
      <div className="h-4 bg-gray-200 rounded-full w-4/5" />
      <div className="h-3 bg-gray-200 rounded-full w-3/5" />
    </div>
  </div>
);

export const Community = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CommunityTab>('general');
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>('all');
  const [devPostType, setDevPostType] = useState<DevPostType>('ALL');
  const [devSortOrder, setDevSortOrder] = useState<SortOrder>('latest');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchInput.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: generalData, isLoading: generalLoading } = useQuery({
    queryKey: ['communityPosts', 'general', sortOrder, mediaFilter, debouncedQuery],
    queryFn: () =>
      getCommunityPosts({
        size: 20,
        sort: sortOrder.toUpperCase() as 'LATEST' | 'POPULAR',
        mediaFilter: mediaFilter.toUpperCase() as 'ALL' | 'PHOTO' | 'VIDEO' | 'TEXT',
        query: debouncedQuery || undefined,
      }),
    enabled: activeTab === 'general',
  });

  const { data: devData, isLoading: devLoading } = useQuery({
    queryKey: ['communityPosts', 'dev', devPostType, devSortOrder, debouncedQuery],
    queryFn: () =>
      getDevCommunityPosts({
        size: 20,
        postType: devPostType,
        sort: devSortOrder.toUpperCase() as 'LATEST' | 'POPULAR',
        query: debouncedQuery || undefined,
      }),
    enabled: activeTab === 'dev',
  });

  const generalFeeds: ShareFeedItem[] = (generalData?.content ?? []).map((item) => ({
    id: item.seq,
    username: item.writer,
    realName: item.writer,
    profileImage: item.writerProfileImage || undefined,
    postedAt: item.writedAt,
    title: item.title,
    description: '',
    images: item.images?.length
      ? item.images
      : item.thumbnailImage
        ? [item.thumbnailImage]
        : undefined,
    videos: item.videos?.length ? item.videos : undefined,
    likes: item.likes,
    comments: item.comments,
    isBookmarked: item.isBookmarked,
  }));

  const devPosts: DevPostOverViewItem[] = (devData?.content ?? []).map((item) => ({
    seq: item.seq,
    postUuid: item.postUuid,
    title: item.title,
    writer: item.writer,
    writerProfileImage: item.writerProfileImage,
    writedAt: item.writedAt,
    views: item.views,
    comments: item.comments,
    tag: item.techSubTag ? (TECH_SUB_TAG_LABEL[item.techSubTag] ?? item.techSubTag) : undefined,
    techTags: item.techTags?.length ? item.techTags : undefined,
  }));

  return (
    <div className="flex justify-center gap-6 p-8 min-h-screen items-start">
      {/* 왼쪽 sticky 위젯 */}
      <aside className="top-0 self-start shrink-0">
        <LeftWidget />
      </aside>

      {/* 메인 피드 */}
      <main className="flex flex-col items-center gap-8">
        {/* 커뮤니티 탭 */}
        <section className="flex w-180">
          {TABS.map(({ id, label, icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex flex-col items-center gap-1 pb-2 text-sm font-medium transition-all border-b-2 ${
                  isActive
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <img
                  src={icon}
                  alt={label}
                  className={`w-10 h-10 object-contain transition-all duration-200 ${
                    isActive ? 'scale-110 drop-shadow-md' : 'opacity-50 grayscale'
                  }`}
                />
                {label}
              </button>
            );
          })}
        </section>

        {/* 검색 바 + 필터 */}
        <section className="w-180 flex flex-col gap-5">
          {/* 검색 입력 */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="검색어를 입력하세요..."
              className="w-full pl-10 pr-4 py-3 rounded-sm bg-white border border-gray-200 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          {/* 필터 칩 — 일반 탭 */}
          {activeTab === 'general' && (
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {MEDIA_OPTIONS.map(({ id, label, icon: Icon }) => {
                  const active = mediaFilter === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setMediaFilter(id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border transition-all ${
                        active
                          ? 'bg-gray-800 text-white border-gray-800 shadow-sm'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <Icon size={12} />
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-1.5">
                {SORT_OPTIONS.map(({ id, label, icon: Icon }) => {
                  const active = sortOrder === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setSortOrder(id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border transition-all ${
                        active
                          ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <Icon size={12} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 필터 칩 — 개발 탭 */}
          {activeTab === 'dev' && (
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {DEV_POST_TYPE_OPTIONS.map(({ id, label, icon: Icon }) => {
                  const active = devPostType === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setDevPostType(id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border transition-all ${
                        active
                          ? 'bg-gray-800 text-white border-gray-800 shadow-sm'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <Icon size={12} />
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-1.5">
                {SORT_OPTIONS.map(({ id, label, icon: Icon }) => {
                  const active = devSortOrder === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setDevSortOrder(id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border transition-all ${
                        active
                          ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <Icon size={12} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* 배너 */}
        <AnnounceBanner />

        {/* 피드 목록 */}
        {activeTab === 'dev' ? (
          <div className="w-180">
            {devLoading ? (
              <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <PostSkeleton key={i} />
                ))}
              </div>
            ) : (
              <DevPostsOverView
                posts={devPosts}
                onPostClick={(seq) => navigate(`/article/${seq}`)}
              />
            )}
          </div>
        ) : generalLoading ? (
          <div className="w-180 bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : generalFeeds.length > 0 ? (
          <div className="w-180 bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            {generalFeeds.map((feed, i) => (
              <ShareFeedOverView key={i} feed={feed} />
            ))}
          </div>
        ) : (
          <div className="w-180 flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <span className="text-4xl"></span>
            <p className="text-sm font-medium">해당 조건의 게시글을 찾을 수 없어요</p>
          </div>
        )}
      </main>

      {/* 오른쪽 sticky 위젯 */}
      <aside className="top-0 self-start shrink-0">
        <RightWidget />
      </aside>
    </div>
  );
};
