import axios from './axios';
import type { TradeResponse } from '../types/trade';

export const fetchTradeItems = async (page: number = 0): Promise<TradeResponse> => {
  const res = await axios.get('/api/trade/items/search', {
    params: {
      category: 'FOOD',
      active: true,
      page,
      size: 20,
      sort: 'createdAt',
      dir: 'desc',
    },
  });

  return res.data.data;
};
