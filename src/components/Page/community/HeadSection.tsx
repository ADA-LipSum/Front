import { CreatePostButton } from './CreatePostButton';
import { SearchBar } from './SearchBar';

interface HeadSectionProps {
  className?: string;
  onSearch?: (query: string) => void;
}

export const HeadSection = ({ className, onSearch }: HeadSectionProps) => {
  return (
    <div className={`flex items-center gap-3 mb-4 ${className}`}>
      <SearchBar className="flex-1" onSearch={onSearch} />
      <CreatePostButton onClick={() => alert('글쓰기 버튼 클릭')} />
    </div>
  );
};
