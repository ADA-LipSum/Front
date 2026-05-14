const FILTERS = ['전체', '기술', '밈', '프로젝트 자랑', '기타'];

interface FilterBarProps {
  className?: string;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export const FilterBar = ({ className, activeFilter = '전체', onFilterChange }: FilterBarProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onFilterChange?.(f)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeFilter === f
              ? 'bg-blue-500 text-white shadow shadow-blue-200'
              : 'bg-white border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-500'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
};
