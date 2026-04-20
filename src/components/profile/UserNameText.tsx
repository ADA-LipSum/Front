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
      <div className="text-center mt-5 w-full max-w-sm min-w-50">
        <input
          type="text"
          value={editValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder="닉네임을 입력하세요"
          maxLength={10}
          className={`w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow h-15 text-center font-bold ${isOver ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-blue-400'}`}
        />
        <p className={`text-xs mt-3 ${isOver ? 'text-red-500' : 'text-gray-400'}`}>
          {editValue.length}/10
        </p>
      </div>
    );
  }

  return (
    <div className="text-center mt-5 w-full max-w-sm min-w-50">
      <H2>{profile?.userNickname || profile?.userRealname}</H2>
    </div>
  );
};

export default UserNameText;
