import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string | null;
}

export type ExchangeCategory = 'FOOD' | 'ETC';
export type ExchangeSubCategory = 'SNACK' | 'CANDY' | 'JUICE' | 'INSTANT' | 'STICKER' | 'BANNER';

export interface ExchangeSearchParam {
  keyword?: string;
  category?: ExchangeCategory;
  subCategory?: ExchangeSubCategory;
  minPrice?: number;
  maxPrice?: number;
  active?: boolean;
  page?: number;
  size?: number;
  sort?: 'createdAt' | 'price' | 'name';
  dir?: 'asc' | 'desc';
}

export interface ExchangeSearchResponse {
  id: number;
  itemUuid: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  category: string;
  imageUrl: string;
  createdAt: string;
  stock?: number;
}

export interface ExchangePageResponse {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: ExchangeSearchResponse[];
}

export const searchExchanges = async (
  params: ExchangeSearchParam,
): Promise<ExchangePageResponse> => {
  try {
    const response = await axios.get<ApiResponse<ExchangePageResponse>>(
      '/api/trade/items/search',
      { params },
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || '교환 상품 검색 실패');
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '교환 상품 검색 실패');
  }
};
