// TODO: 어짜피 단순 조회용이라서 TANSTACK QUERY로 바꿔도 될 것 같음.
import { create } from 'zustand';
import { searchExchanges } from '@/api/exchange';
import type { ExchangeSearchParam, ExchangeSearchResponse } from '@/api/exchange';

interface ExchangeStore {
  items: ExchangeSearchResponse[];
  totalPages: number;
  totalElements: number;
  loading: boolean;
  error: string | null;
  searchParams: Partial<ExchangeSearchParam>;
  search: (params: ExchangeSearchParam) => Promise<void>;
  setSearchParams: (params: Partial<ExchangeSearchParam>) => void;
  clearExchange: () => void;
}

export const useExchangeStore = create<ExchangeStore>((set) => ({
  items: [],
  totalPages: 1,
  totalElements: 0,
  loading: false,
  error: null,
  searchParams: {},

  search: async (params) => {
    set({ loading: true, error: null });
    try {
      const result = await searchExchanges(params);
      set({
        loading: false,
        items: result.content,
        totalPages: result.totalPages,
        totalElements: result.totalElements,
        searchParams: params,
      });
    } catch (err: any) {
      set({ loading: false, error: err.message || '교환 상품 검색 실패' });
    }
  },

  setSearchParams: (params) => {
    set((state) => ({ searchParams: { ...state.searchParams, ...params } }));
  },

  clearExchange: () => {
    set({
      items: [],
      loading: false,
      error: null,
      searchParams: {},
      totalPages: 1,
      totalElements: 0,
    });
  },
}));
