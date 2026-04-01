import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string | null;
}

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface TradeItemDto {
  uuid?: string;
  itemUuid?: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  active?: boolean;
  category?: string;
  imageUrl?: string | null;
}

export interface TradeItem {
  itemUuid: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  category: string;
  imageUrl?: string | null;
}

const mapTradeItem = (dto: TradeItemDto): TradeItem => ({
  itemUuid: dto.itemUuid ?? dto.uuid ?? '',
  name: dto.name ?? '이름 없는 아이템',
  description: dto.description ?? '',
  price: dto.price ?? 0,
  stock: dto.stock ?? 0,
  active: dto.active ?? true,
  category: dto.category ?? 'ETC',
  imageUrl: dto.imageUrl ?? null,
});

export interface SearchTradeItemsParams {
  keyword?: string;
  category?: 'FOOD' | 'ETC';
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
}

export interface SearchTradeItemsResult {
  items: TradeItem[];
  totalPages: number;
  totalElements: number;
}

export const searchTradeItems = async (
  params: SearchTradeItemsParams,
): Promise<SearchTradeItemsResult> => {
  const res = await axios.get<ApiResponse<PageResponse<TradeItemDto>>>(
    '/api/trade/items/search',
    {
      params: {
        keyword: params.keyword || undefined,
        category: params.category || undefined,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        active: true,
        page: params.page ?? 0,
        size: params.size ?? 20,
      },
    },
  );

  return {
    items: (res.data.data.content ?? []).map(mapTradeItem),
    totalPages: res.data.data.totalPages ?? 1,
    totalElements: res.data.data.totalElements ?? 0,
  };
};

export const purchaseTradeItem = async (itemUuid: string, quantity: number) => {
  return axios.post('/api/trade/transactions', { itemUuid, quantity });
};

