import { Search, Hash, PenSquare } from 'lucide-react';

interface SearchFilterSectionProps {
  searchKeyword: string;
  tagKeyword: string;
  onSearchKeywordChange: (v: string) => void;
  onTagKeywordChange: (v: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onWriteClick: () => void;
}

export const SearchFilterSection = ({
  searchKeyword,
  tagKeyword,
  onSearchKeywordChange,
  onTagKeywordChange,
  onSearch,
  onReset,
  onWriteClick,
}: SearchFilterSectionProps) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 border border-[#E0E0E0] rounded bg-white px-3 py-2">
          <Search className="w-4 h-4 text-[#757575] shrink-0" />
          <input
            type="text"
            placeholder="스터디를 검색해보세요!"
            value={searchKeyword}
            onChange={(e) => onSearchKeywordChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            className="flex-1 outline-none text-sm placeholder:text-[#9E9E9E]"
          />
        </div>
        <div className="flex-1 min-w-[200px] flex items-center gap-2 border border-[#E0E0E0] rounded bg-white px-3 py-2">
          <Hash className="w-4 h-4 text-[#757575] shrink-0" />
          <input
            type="text"
            placeholder="태그로 검색해보세요!"
            value={tagKeyword}
            onChange={(e) => onTagKeywordChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            className="flex-1 outline-none text-sm placeholder:text-[#9E9E9E]"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={onSearch}
            className="px-4 py-2 bg-[#4A4A4A] text-white text-sm font-medium rounded hover:bg-[#3A3A3A] transition"
          >
            검색
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 bg-[#4A4A4A] text-white text-sm font-medium rounded hover:bg-[#3A3A3A] transition"
          >
            초기화
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={onWriteClick}
        className="flex items-center gap-2 px-4 py-2 bg-[#4A4A4A] text-white text-sm font-medium rounded hover:bg-[#3A3A3A] transition"
      >
        <PenSquare className="w-4 h-4" />
        글 쓰기
      </button>
    </div>
  );
};
