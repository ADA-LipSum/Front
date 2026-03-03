import { useState } from 'react';

export interface TagWithCount {
  name: string;
  count: number;
}

const DISPLAY_LIMIT = 5;

interface PopularTagsProps {
  tagsWithCount: TagWithCount[];
  onTagClick?: (tag: string) => void;
}

export const PopularTags = ({ tagsWithCount, onTagClick }: PopularTagsProps) => {
  const [showAll, setShowAll] = useState(false);
  const displayTags = showAll ? tagsWithCount : tagsWithCount.slice(0, DISPLAY_LIMIT);
  const hasMore = tagsWithCount.length > DISPLAY_LIMIT;

  return (
    <div className="bg-white rounded border border-[#E0E0E0] p-4 shadow-sm">
      <h3 className="text-center font-bold text-black mb-4">인기 태그</h3>
      {tagsWithCount.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-2">
            {displayTags.map(({ name, count }) => (
              <button
                key={name}
                type="button"
                onClick={() => onTagClick?.(name)}
                className="px-2 py-1 text-sm rounded bg-[#E0E0E0] text-[#616161] hover:bg-[#BDBDBD] transition text-left"
              >
                <span className="font-medium">#{name}</span>
                <span className="ml-1 text-xs text-[#9E9E9E]">({count})</span>
              </button>
            ))}
          </div>
          {hasMore && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="w-full mt-3 py-2 text-sm font-medium text-[#4A4A4A] border border-[#E0E0E0] rounded hover:bg-[#FAFAFA] transition"
            >
              {showAll ? '접기' : '전부보기'}
            </button>
          )}
        </>
      ) : (
        <p className="text-sm text-[#9E9E9E] text-center py-2">등록된 태그가 없습니다.</p>
      )}
    </div>
  );
};
