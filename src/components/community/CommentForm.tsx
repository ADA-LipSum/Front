import { useState, type FormEvent } from 'react';
import { MessageCircle } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (content: string, author: string) => void;
  placeholderAuthor?: string;
}

export const CommentForm = ({ onSubmit, placeholderAuthor = '닉네임' }: CommentFormProps) => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedContent = content.trim();
    const trimmedAuthor = author.trim() || '익명';
    if (!trimmedContent) return;
    onSubmit(trimmedContent, trimmedAuthor);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-4 bg-[#FAFAFA] rounded border border-[#E0E0E0]">
      <div className="flex flex-wrap gap-3 mb-3">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder={placeholderAuthor}
          className="w-32 px-3 py-2 border border-[#E0E0E0] rounded text-sm outline-none focus:border-[#4A4A4A]"
          maxLength={20}
        />
        <span className="text-xs text-[#9E9E9E] self-center">(비워두면 익명)</span>
      </div>
      <div className="flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요..."
          rows={3}
          className="flex-1 px-3 py-2 border border-[#E0E0E0] rounded text-sm outline-none focus:border-[#4A4A4A] resize-y min-h-[80px]"
          required
        />
        <button
          type="submit"
          className="shrink-0 flex items-center gap-2 px-4 py-2 bg-[#4A4A4A] text-white text-sm font-medium rounded hover:bg-[#3A3A3A] transition h-fit"
        >
          <MessageCircle className="w-4 h-4" />
          등록
        </button>
      </div>
    </form>
  );
};
