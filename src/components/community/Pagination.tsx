import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MAX_VISIBLE = 10;

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const start = Math.max(1, Math.min(currentPage - Math.floor(MAX_VISIBLE / 2), totalPages - MAX_VISIBLE + 1));
  const end = Math.min(totalPages, start + MAX_VISIBLE - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="p-2 rounded hover:bg-[#EEEEEE] transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`min-w-[32px] h-8 rounded text-sm font-medium transition ${
              currentPage === page
                ? 'bg-[#4A4A4A] text-white underline'
                : 'hover:bg-[#EEEEEE] text-black'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="p-2 rounded hover:bg-[#EEEEEE] transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === totalPages || totalPages === 0}
        aria-label="다음 페이지"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
