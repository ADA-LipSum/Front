import { useState } from 'react';
import { ChevronDown, LogIn } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Avatar from '@/components/global/Avatar';
import { getCommunityMyStats } from '@/api/communityMyStats';
import { useAuthStore } from '@/store/authStore';
import { Tooltip } from 'react-tooltip';

export const ProfileCard = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [openProfile, setOpenProfile] = useState(true);

  const { data: stats } = useQuery({
    queryKey: ['communityMyStats'],
    queryFn: getCommunityMyStats,
    retry: false,
  });

  return (
    <div className="bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm">
      <button
        onClick={() => setOpenProfile((v) => !v)}
        className="w-full px-4 pt-4 pb-2 flex items-center gap-2 text-left"
      >
        <span className="text-sm font-semibold text-gray-700">내 활동</span>
        <ChevronDown
          size={14}
          className={`ml-auto text-gray-400 transition-transform duration-200 ${openProfile ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`transition-all duration-200 overflow-hidden ${openProfile ? 'max-h-60' : 'max-h-0'}`}
      >
        {!accessToken ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 px-4 text-center">
            <LogIn size={26} className="text-gray-300" />
            <p className="text-sm text-gray-400">로그인하여 활동을 확인하세요!</p>
          </div>
        ) : (
          <div className="px-4 pb-4">
            <div className="flex items-center gap-3">
              <Avatar name={stats?.realName ?? ''} src={stats?.profileImage} size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {stats?.realName ?? '—'}
                </p>
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
              <Tooltip id="stat-tooltip" place="top" className="text-xs z-50" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
