import type { InventoryItem } from './InventoryItemCard';

interface InventoryBannerCardProps {
  item: InventoryItem;
}

export const InventoryBannerCard = ({ item }: InventoryBannerCardProps) => {
  const formattedDate = item.acquiredAt
    ? new Date(item.acquiredAt).toLocaleDateString('ko-KR')
    : null;

  return (
    <div className="overflow-hidden transition-shadow">
      <div className="bg-gray-50 overflow-hidden" style={{ aspectRatio: '3 / 1' }}>
        <img
          src={item.imageUrl}
          alt={item.itemName}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-gray-800 truncate">{item.itemName}</p>
        {formattedDate && <p className="text-xs text-gray-400 mt-0.5">{formattedDate} 획득</p>}
      </div>
    </div>
  );
};
