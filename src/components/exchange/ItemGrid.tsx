import type { TradeItem } from '@/types/trade';
import ItemCard from './ItemCard';

interface Props {
  items: TradeItem[];
}

const ItemGrid = ({ items }: Props) => {
  return (
    <div className="grid grid-cols-4 gap-6 px-10">
      {items.map((item) => (
        <ItemCard key={item.itemUuid} item={item} />
      ))}
    </div>
  );
};

export default ItemGrid;
