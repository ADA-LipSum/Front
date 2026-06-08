import { ChevronLeft, ChevronRight, LogIn } from 'lucide-react';
import { useState } from 'react';
import Avatar from '@/components/global/Avatar';
import { useQuery } from '@tanstack/react-query';
import { getCommunityMyStats } from '@/api/communityMyStats';
import { getPopularTags } from '@/api/popularTags';
import { useAuthStore } from '@/store/authStore';
import { Tooltip } from 'react-tooltip';

// TODO: 실제 이벤트 API 연동 시 교체
const MOCK_EVENTS = [
  {
    id: 1,
    title: '2026 캡스톤 발표회',
    date: '28–29일',
    location: '컨퍼런스홀',
    description: 'Super Early Bird 등록 시\n₩80,000 할인 — 7월 8일까지.',
    imageUrl: 'https://github.com/static/images/modules/dashboard/promos/universe26.webp',
  },
  {
    id: 2,
    title: '오픈소스 해커톤 2026',
    date: '7월 15일',
    location: '온라인',
    description: '48시간 해커톤에 참가하고\n최대 ₩500,000 상금을 받아가세요.',
    imageUrl: 'https://github.com/static/images/modules/dashboard/promos/universe26.webp',
  },
  {
    id: 3,
    title: '개발자 네트워킹 밋업',
    date: '8월 3일',
    location: '서울 강남구',
    description: '현직 개발자들과 함께하는\n커리어 네트워킹 이벤트.',
    imageUrl: 'https://github.com/static/images/modules/dashboard/promos/universe26.webp',
  },
];

export const RightWidget = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [eventIndex, setEventIndex] = useState(0);

  const currentEvent = MOCK_EVENTS[eventIndex];
  const total = MOCK_EVENTS.length;
  const { data: stats } = useQuery({
    queryKey: ['communityMyStats'],
    queryFn: getCommunityMyStats,
    retry: false,
  });

  const { data: popularTags } = useQuery({
    queryKey: ['popularTags'],
    queryFn: getPopularTags,
    staleTime: 1000 * 60 * 60,
  });

  return (
    <div className="flex flex-col gap-4 py-8 w-72">
      {/* 다가오는 이벤트 배너 — TODO: 실제 이벤트 API 연동 시 데이터 교체 */}
      <div className="relative bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm">
        {/* 이벤트명 + 페이지네이션 */}
        <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2">
          <h2 className="text-md font-black tracking-tight leading-none text-gray-900 wrap-break-word">
            {currentEvent.title}
          </h2>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setEventIndex((i) => (i - 1 + total) % total)}
              className="p-0.5 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
              aria-label="이전 이벤트"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[11px] font-bold text-gray-400 tabular-nums">
              {eventIndex + 1}/{total}
            </span>
            <button
              onClick={() => setEventIndex((i) => (i + 1) % total)}
              className="p-0.5 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
              aria-label="다음 이벤트"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* 아트 영역 — 이미지 자리 */}
        <div className="mx-4 rounded-sm overflow-hidden bg-gray-100 relative">
          <img
            src={currentEvent.imageUrl}
            alt={currentEvent.title}
            className="w-full h-32 object-cover"
          />
        </div>

        {/* 콘텐츠 */}
        <div className="px-4 pt-3 pb-4">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-2.5">
            <span>{currentEvent.date}</span>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-sm shrink-0" />
            <span>{currentEvent.location}</span>
          </div>
          <p className="text-sm font-bold leading-snug text-gray-900 mb-3 whitespace-pre-line">
            {currentEvent.description}
          </p>
          <button className="w-full py-2.5 bg-gray-900 hover:bg-gray-700 active:bg-gray-600 transition text-sm font-bold text-white rounded-lg">
            자세히 보기
          </button>
        </div>

        {/* 하단 dot 인디케이터 */}
        <div className="flex justify-center gap-1.5 pb-3">
          {MOCK_EVENTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setEventIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === eventIndex ? 'bg-gray-900' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`${i + 1}번 이벤트`}
            />
          ))}
        </div>
      </div>

      {/* 내 프로필 / 활동 */}
      <div className="bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm">
        {!accessToken ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 px-4 text-center">
            <LogIn size={26} className="text-gray-300" />
            <p className="text-sm text-gray-400">로그인하여 활동을 확인하세요!</p>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Avatar name={stats?.realName ?? ''} src={stats?.profileImage} size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900 truncate">{stats?.realName ?? '—'}</p>
                <p className="text-xs text-gray-400">@{stats?.nickname ?? '—'}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100 text-center">
              <div
                data-tooltip-id="stat-tooltip"
                data-tooltip-content="내가 작성한 게시글 수"
                className="cursor-default"
              >
                <p className="text-base font-bold text-gray-900">{stats?.postCount ?? 0}</p>
                <p className="text-xs text-gray-400 mt-0.5">게시글</p>
              </div>
              <div
                data-tooltip-id="stat-tooltip"
                data-tooltip-content="내 게시글에 받은 좋아요 수"
                className="cursor-default"
              >
                <p className="text-base font-bold text-gray-900">{stats?.receivedLikes ?? 0}</p>
                <p className="text-xs text-gray-400 mt-0.5">좋아요</p>
              </div>
              <div
                data-tooltip-id="stat-tooltip"
                data-tooltip-content="내가 작성한 댓글 수"
                className="cursor-default"
              >
                <p className="text-base font-bold text-gray-900">{stats?.commentCount ?? 0}</p>
                <p className="text-xs text-gray-400 mt-0.5">댓글</p>
              </div>
              <div
                data-tooltip-id="stat-tooltip"
                data-tooltip-content="내 게시글에 받은 이모지 반응 수"
                className="cursor-default"
              ></div>
              <Tooltip id="stat-tooltip" place="top" className="text-xs z-50" />
            </div>
          </div>
        )}
      </div>

      {/* 트렌딩 태그 */}
      <div className="bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm">
        <div className="px-4 pt-4 pb-1">
          <h2 className="text-base font-bold text-gray-900">트렌딩 태그</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {(popularTags ?? []).slice(0, 7).map(({ tag, count }, i) => (
            <button
              key={tag}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <p className="text-xs text-gray-400">{i + 1} · 개발 · Trending</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">#{tag}</p>
              <p className="text-xs text-gray-400 mt-0.5">{count.toLocaleString()}개 게시글</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
