export interface InventoryItem {
  inventoryUuid: string;
  itemUuid: string;
  itemName: string;
  itemDescription?: string;
  imageUrl: string;
  category: string;
  subCategory: string;
  acquiredAt?: string;
}

interface InventoryItemCardProps {
  item: InventoryItem;
}

export const InventoryItemCard = ({ item }: InventoryItemCardProps) => {
  const formattedDate = item.acquiredAt
    ? new Date(item.acquiredAt).toLocaleDateString('ko-KR')
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-gray-50 h-28 flex items-center justify-center p-3">
        <img src={item.imageUrl} alt={item.itemName} className="w-full h-full object-contain" />
      </div>
      <div className="p-2.5">
        <p className="text-xs font-medium text-gray-800 truncate">{item.itemName}</p>
        {formattedDate && <p className="text-[10px] text-gray-400 mt-0.5">{formattedDate} 획득</p>}
      </div>
    </div>
  );
};
