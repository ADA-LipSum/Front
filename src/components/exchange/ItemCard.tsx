import type { TradeItem } from '@/types/trade';

interface Props {
  item: TradeItem;
}

const ItemCard = ({ item }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
      <img src={item.imageUrl} className="w-28 h-28 object-contain" />

      <div className="mt-3 text-sm font-semibold text-center">{item.name}</div>

      <div className="text-gray-500 text-sm">{item.price.toLocaleString()} P</div>

      <button className="mt-3 bg-blue-500 text-white px-4 py-1 rounded">구매</button>
    </div>
  );
};

export default ItemCard;
