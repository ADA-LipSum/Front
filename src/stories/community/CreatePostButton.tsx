import { PenLine } from 'lucide-react';

export const CreatePostButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 bg-blue-500 text-white rounded-xl px-4 py-2.5 hover:bg-blue-600 active:scale-95 transition-all font-medium text-sm whitespace-nowrap shadow-sm shadow-blue-200"
    >
      <PenLine size={15} />
      글 작성하기
    </button>
  );
};
