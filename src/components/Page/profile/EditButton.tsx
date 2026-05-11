interface EditButtonProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
}

export const EditButton = ({ isEditing, onEdit, onSave, onCancel }: EditButtonProps) => {
  if (isEditing) {
    return (
      <>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={onSave}
        >
          저장
        </button>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300 transition-colors"
          onClick={onCancel}
        >
          취소
        </button>
      </>
    );
  }

  return (
    <button
      className="px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300 transition-colors"
      onClick={onEdit}
    >
      프로필 편집
    </button>
  );
};
