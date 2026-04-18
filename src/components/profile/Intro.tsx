import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

interface IntroProps {
  isEditing: boolean;
  editValue: string;
  onChange: (value: string) => void;
}

const Intro = ({ isEditing, editValue, onChange }: IntroProps) => {
  const { profile } = useSelector((state: RootState) => state.profile);

  if (isEditing) {
    return (
      <div className="text-center mt-5 w-full max-w-5xl">
        <textarea
          value={editValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder="소개를 입력하세요"
          rows={3}
          maxLength={255}
          className="w-full border-2 border-gray-300 rounded px-3 py-2 text-center text-gray-600 resize-none focus:outline-none focus:border-blue-400"
        />
        <p>
          <span className="text-sm">{editValue.length}/255</span>
        </p>
      </div>
    );
  }

  return (
    <div className="text-center mt-5 w-full max-w-5xl mx-auto">
      {profile?.intro ? (
        <p className="text-gray-600">
          {profile.intro.split('\n').flatMap((line, li, lines) => {
            const chunks = Array.from({ length: Math.ceil(line.length / 100) || 1 }, (_, i) =>
              line.slice(i * 100, (i + 1) * 100),
            );
            return chunks.flatMap((chunk, ci, arr) => {
              const isLastChunk = ci === arr.length - 1;
              const isLastLine = li === lines.length - 1;
              return [
                <span key={`${li}-${ci}`}>{chunk}</span>,
                ...(isLastChunk && isLastLine ? [] : [<br key={`br-${li}-${ci}`} />]),
              ];
            });
          })}
        </p>
      ) : (
        <p className="text-gray-600">소개가 없습니다.</p>
      )}
    </div>
  );
};

export default Intro;
