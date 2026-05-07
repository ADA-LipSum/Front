import { CreatePostButton } from './CreatePostButton';
import { SearchBar } from './SearchBar';

export const HeadSection = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 mb-4 ${className}`}>
      <SearchBar className="flex-1" />
      <CreatePostButton onClick={() => alert('글쓰기 버튼 클릭')} />
    </div>
  );
};
