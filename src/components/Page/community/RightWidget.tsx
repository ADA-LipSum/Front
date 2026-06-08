import { LogIn } from 'lucide-react';
import Avatar from '@/components/global/Avatar';
import { useQuery } from '@tanstack/react-query';
import { getCommunityMyStats } from '@/api/communityMyStats';
import { getPopularTags } from '@/api/popularTags';
import { useAuthStore } from '@/store/authStore';

export const RightWidget = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
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
      {/* 내 프로필 / 활동 */}
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
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
            <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-gray-100 text-center">
              <div>
                <p className="text-base font-bold text-gray-900">{stats?.postCount ?? 0}</p>
                <p className="text-xs text-gray-400 mt-0.5">게시글</p>
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">{stats?.receivedLikes ?? 0}</p>
                <p className="text-xs text-gray-400 mt-0.5">좋아요</p>
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">{stats?.commentCount ?? 0}</p>
                <p className="text-xs text-gray-400 mt-0.5">댓글</p>
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">{stats?.receivedReactions ?? 0}</p>
                <p className="text-xs text-gray-400 mt-0.5">반응</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 트렌딩 태그 */}
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
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
