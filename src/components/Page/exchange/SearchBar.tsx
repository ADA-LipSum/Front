import { Search } from 'lucide-react';

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex items-center border pl-4 gap-3 bg-white border-gray-500/30 h-12 rounded-lg overflow-hidden w-full">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="상품 이름으로 검색"
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full h-full outline-none text-gray-500 placeholder-gray-500 text-base"
        />
      </div>
    </div>
  );
};
