interface LoginButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const LoginButton = ({ onClick, disabled }: LoginButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black transition-colors text-base tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
    >
      로그인 →
    </button>
  );
};
