import type { ConfirmButtonProps } from '../../types/confirmButton';

export default function ConfirmModal({
  onConfirm,
  onCancel,
  confirmTitle = '댓글을 정말 삭제하시겠습니까?',
  confirmText = '확인',
  cancelText = '취소',
}: ConfirmButtonProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <p className="mb-4">{confirmTitle}</p>
        <div className="flex justify-center space-x-4">
          <button onClick={onCancel} className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
