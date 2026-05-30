import type { InventoryItem } from './InventoryItemCard';

interface InventoryBannerCardProps {
  item: InventoryItem;
}

export const InventoryBannerCard = ({ item }: InventoryBannerCardProps) => {
  const formattedDate = item.acquiredAt
    ? new Date(item.acquiredAt).toLocaleDateString('ko-KR')
    : null;

  return (
    <div className="bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-shadow rounded-xl">
      <div className="bg-gray-50 overflow-hidden" style={{ aspectRatio: '3 / 1' }}>
        <img
          src={item.imageUrl}
          alt={item.itemName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-gray-800 truncate">{item.itemName}</p>
        {formattedDate && (
          <p className="text-xs text-gray-400 mt-0.5">{formattedDate} 획득</p>
        )}
      </div>
    </div>
  );
};
