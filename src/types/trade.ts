export interface TradeItem {
  id: number;
  itemUuid: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  category: 'FOOD' | 'TOOLS' | 'ETC';
  imageUrl: string;
  createdAt: string;
}

export interface TradeResponse {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: TradeItem[];
}
