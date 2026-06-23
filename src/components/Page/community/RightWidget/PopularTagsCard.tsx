import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getPopularTags } from '@/api/popularTags';

export const PopularTagsCard = () => {
  const [openTags, setOpenTags] = useState(true);

  const { data: popularTags } = useQuery({
    queryKey: ['popularTags'],
    queryFn: getPopularTags,
    staleTime: 1000 * 60 * 60,
  });

  return (
    <div className="bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm">
      <button
        onClick={() => setOpenTags((v) => !v)}
        className="w-full px-4 pt-4 pb-2 flex items-center gap-2 text-left"
      >
        <span className="text-sm font-semibold text-gray-700">트렌딩 태그</span>
        <ChevronDown
          size={14}
          className={`ml-auto text-gray-400 transition-transform duration-200 ${openTags ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`transition-all duration-200 overflow-hidden ${openTags ? 'max-h-150' : 'max-h-0'}`}>
        <div className="divide-y divide-gray-50">
          {(popularTags ?? []).length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400">아직 인기 태그가 없습니다.</div>
          ) : (
            (popularTags ?? []).slice(0, 7).map(({ tag, count }, i) => (
              <button
                key={tag}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <p className="text-xs text-gray-400">{i + 1} · 개발 · Trending</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">#{tag}</p>
                <p className="text-xs text-gray-400 mt-0.5">{count.toLocaleString()}개 게시글</p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
