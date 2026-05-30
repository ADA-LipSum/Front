import { useState } from 'react';
import { CannotLoginModal } from './CannotLoginModal';

interface LoginOptionsProps {
  rememberMe: boolean;
  onRememberMeChange: (value: boolean) => void;
}

export const LoginOptions = ({ rememberMe, onRememberMeChange }: LoginOptionsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => onRememberMeChange(e.target.checked)}
            className="w-4 h-4 rounded accent-gray-900 cursor-pointer"
          />
          로그인 상태 유지
        </label>
        <button
          type="button"
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          계정에 로그인할 수 없어요
        </button>
      </div>
      {isModalOpen && <CannotLoginModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};
