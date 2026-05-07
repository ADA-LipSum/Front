import { Search } from 'lucide-react';

export const SearchBar = ({ className }: { className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={16}
      />
      <input
        type="text"
        placeholder="궁금한 내용을 검색해보세요"
        className="bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent rounded-xl py-2.5 pl-9 pr-4 w-full text-sm placeholder:text-gray-400 transition-all"
      />
    </div>
  );
};
