import { EditButton } from './EditButton';
import { InventoryButton } from './InventoryButton';

export const ButtonSection = () => {
  return (
    <div className="absolute right-4 top-110 flex gap-5 *:static">
      <InventoryButton />
      <EditButton />
    </div>
  );
};
