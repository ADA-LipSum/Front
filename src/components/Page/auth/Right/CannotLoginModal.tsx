interface CannotLoginModalProps {
  onClose: () => void;
}

export const CannotLoginModal = ({ onClose }: CannotLoginModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl px-10 py-9 w-96 flex flex-col items-center gap-5 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-base font-semibold text-gray-800">계정 로그인 안내</p>
          <p className="text-sm text-gray-500 leading-relaxed mt-1">
            계정은 관리자가 미리 생성해둡니다.
            <br />
            계정 분실 시 관리자 또는 선생님께 문의 바랍니다.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          알겠어요
        </button>
      </div>
    </div>
  );
};
