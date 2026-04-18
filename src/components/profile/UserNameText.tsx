import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import H2 from '../tags/H2';

interface UserNameTextProps {
  isEditing: boolean;
  editValue: string;
  onChange: (value: string) => void;
}

const UserNameText = ({ isEditing, editValue, onChange }: UserNameTextProps) => {
  const { profile } = useSelector((state: RootState) => state.profile);

  if (isEditing) {
    const isOver = editValue.length > 10;
    return (
      <div className="text-center mt-5">
        <input
          type="text"
          value={editValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder="닉네임을 입력하세요"
          maxLength={10}
          className={`rounded h-15 border-2 text-center text-xl font-bold focus:outline-none ${isOver ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-blue-400'}`}
        />
        <p className={`text-xs mt-1 ${isOver ? 'text-red-500' : 'text-gray-400'}`}>
          {editValue.length}/10
        </p>
      </div>
    );
  }

  return (
    <div className="text-center mt-5">
      <H2>{profile?.userNickname || profile?.userRealname}</H2>
    </div>
  );
};

export default UserNameText;
