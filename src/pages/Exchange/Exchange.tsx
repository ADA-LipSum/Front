import { useEffect, useState } from 'react';
import { fetchTradeItems } from '@/api/trade';
import type { TradeItem } from '@/types/trade';

import ExchangeBanner from '@/components/exchange/ExchangeBanner';
import ItemGrid from '@/components/exchange/ItemGrid';

const ExchangePage = () => {
  const [items, setItems] = useState<TradeItem[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    loadItems();
  }, [page]);

  const loadItems = async () => {
    try {
      const data = await fetchTradeItems(page);
      setItems(data.content);
    } catch (err) {
      console.error('상품 목록 불러오기 실패', err);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <ExchangeBanner />

      <ItemGrid items={items} />
    </div>
  );
};

export default ExchangePage;
