import { useState } from 'react';

const FILTERS = ['전체', '기술', '밈', '프로젝트 자랑', '기타'];

export const FilterBar = ({ className }: { className?: string }) => {
  const [active, setActive] = useState('전체');

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => setActive(f)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            active === f
              ? 'bg-blue-500 text-white shadow-sm shadow-blue-200'
              : 'bg-white border border-gray-200 text-gray-500 hover:border-blue-200 hover:text-blue-500'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
};
