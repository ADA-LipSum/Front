import { EditButton } from './EditButton';
import { InventoryButton } from './InventoryButton';

interface ButtonGroupProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
}

export const ButtonGroup = ({ isEditing, onEdit, onSave, onCancel }: ButtonGroupProps) => {
  return (
    <div className="absolute right-4 top-110 flex gap-5 *:static">
      {!isEditing && <InventoryButton />}
      <EditButton isEditing={isEditing} onEdit={onEdit} onSave={onSave} onCancel={onCancel} />
    </div>
  );
};
