interface LoginButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const LoginButton = ({ onClick, disabled, loading }: LoginButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black transition-colors text-base tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          로그인 중...
        </>
      ) : (
        '로그인 →'
      )}
    </button>
  );
};
