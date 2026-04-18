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
      <div className="text-center mt-5 w-full max-w-6xl">
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
    <div className="text-center mt-5 w-full max-w-6xl mx-auto">
      {profile?.intro ? (
        <p className="text-gray-600 whitespace-pre-wrap">{profile.intro}</p>
      ) : (
        <p className="text-gray-600">소개가 없습니다.</p>
      )}
    </div>
  );
};

export default Intro;
