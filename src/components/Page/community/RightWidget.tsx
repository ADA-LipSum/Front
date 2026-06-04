import { Heart, MessageCircle, FileText, Smile } from 'lucide-react';
import Avatar from '@/components/global/Avatar';

interface Tag {
  label: string;
  count: string | number;
  color: string;
}

const POPULAR_TAGS: Tag[] = [
  { label: 'React', count: '999+', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { label: 'TypeScript', count: '98', color: 'bg-green-50 text-green-600 border-green-200' },
  { label: 'JavaScript', count: '76', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  { label: 'Python', count: '64', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { label: 'Java', count: '51', color: 'bg-pink-50 text-pink-600 border-pink-200' },
  { label: 'C++', count: '43', color: 'bg-orange-50 text-orange-600 border-orange-200' },
  { label: 'Go', count: '38', color: 'bg-teal-50 text-teal-600 border-teal-200' },
  { label: 'Rust', count: '29', color: 'bg-red-50 text-red-600 border-red-200' },
];

const WEEKLY_ACTIVITY = [12, 5, 20, 8, 15, 3, 18];
const WEEK_DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const MAX_ACTIVITY = Math.max(...WEEKLY_ACTIVITY);

const MOCK_USER = {
  name: '김태호',
  username: 'rlaxogh76',
  profileImage:
    'https://2026project-s3-ada.s3.ap-northeast-2.amazonaws.com/profiles/1b6f8f54-a6e5-4cc3-bd30-afec528c29ed/19cbdc9e-7924-4fa3-9043-6e6cddb80168.jpg',
  posts: '24',
  likes: '187',
  comments: '63',
  reactions: '41',
};

export const RightWidget = () => {
  return (
    <div className="flex flex-col gap-4 py-25 w-68">
      {/* 내 활동 요약 */}
      <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden">
        {/* 프로필 헤더 */}
        <div className="px-4 pt-4 pb-3 flex items-center gap-3 border-b border-gray-300">
          <Avatar name={MOCK_USER.name} src={MOCK_USER.profileImage} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{MOCK_USER.name}</p>
            <p className="text-xs text-gray-400">@{MOCK_USER.username}</p>
          </div>
        </div>

        {/* 스탯 그리드 */}
        <div className="grid grid-cols-2 gap-px bg-gray-100 border-b border-gray-300">
          {[
            { icon: FileText, label: '작성한 글', value: MOCK_USER.posts, color: 'text-blue-500' },
            { icon: Heart, label: '받은 좋아요', value: MOCK_USER.likes, color: 'text-red-400' },
            {
              icon: MessageCircle,
              label: '댓글',
              value: MOCK_USER.comments,
              color: 'text-green-500',
            },
            {
              icon: Smile,
              label: '받은 반응',
              value: MOCK_USER.reactions,
              color: 'text-orange-400',
            },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white px-4 py-3 flex flex-col gap-1">
              <Icon size={14} className={color} />
              <p className="text-lg font-bold text-gray-800 leading-none">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* 주간 활동 바 차트 */}
        <div className="px-4 pt-3 pb-4">
          <p className="text-xs font-semibold text-gray-500 mb-3">이번 주 활동</p>
          <div className="flex items-end gap-1.5 h-14">
            {WEEKLY_ACTIVITY.map((val, i) => {
              const heightPct = Math.round((val / MAX_ACTIVITY) * 100);
              const isToday = i === new Date().getDay() - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end" style={{ height: '44px' }}>
                    <div
                      className={`w-full rounded-t-sm transition-all ${
                        isToday ? 'bg-blue-400' : 'bg-gray-200'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs ${isToday ? 'text-blue-500 font-semibold' : 'text-gray-400'}`}
                  >
                    {WEEK_DAYS[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 인기 태그 */}
      <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden">
        <div className="px-4 pt-4 pb-3 flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">인기 개발 태그</span>
        </div>
        <div className="px-4 pb-4 flex flex-wrap gap-2">
          {POPULAR_TAGS.map(({ label, count, color }) => (
            <button
              key={label}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all hover:opacity-80 ${color}`}
            >
              <span>#</span>
              <span>{label}</span>
              <span className="opacity-60">{count}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
