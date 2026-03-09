import { Link } from 'react-router-dom';

export interface StudyCardProps {
  id: string;
  title: string;
  author: string;
  timeAgo: string;
  tags: string[];
  avatarSrc?: string;
}

export const StudyCard = ({ id, title, author, timeAgo, tags, avatarSrc }: StudyCardProps) => {
  const safeAuthor = author || '익명';
  const initial = safeAuthor.charAt(0).toUpperCase();

  return (
    <Link to={`/community/${id}`}>
      <article className="flex gap-4 py-4 border-b border-[#E0E0E0] last:border-b-0 hover:bg-[#FAFAFA] transition rounded px-1 -mx-1 cursor-pointer">
        <div className="shrink-0">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt=""
              className="w-12 h-12 rounded-full object-cover bg-[#E0E0E0]"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#8B7355] flex items-center justify-center text-white text-xs font-medium">
              {initial}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-black mb-1 truncate">{title}</h3>
          <p className="text-sm text-[#757575] mb-2">
            {safeAuthor} - {timeAgo}
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded bg-[#E0E0E0] text-[#616161]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
};
