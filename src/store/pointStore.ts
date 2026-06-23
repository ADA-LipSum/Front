// TODO: 어짜피 단순 조회용이라서 TANSTACK QUERY로 바꿔도 될 것 같음.
import { create } from 'zustand';
import { fetchPointsBalance, fetchPointTransactions } from '@/api/points';
import type { PointTransaction } from '@/api/points';

interface PointStore {
  balance: number;
  transactions: PointTransaction[];
  loading: boolean;
  error: string | null;
  fetchBalance: (userUuid: string) => Promise<void>;
  fetchTransactions: (userUuid: string, page?: number, size?: number) => Promise<void>;
  clearPoint: () => void;
}

export const usePointStore = create<PointStore>((set) => ({
  balance: 0,
  transactions: [],
  loading: false,
  error: null,

  fetchBalance: async (userUuid) => {
    set({ loading: true, error: null });
    try {
      const balance = await fetchPointsBalance(userUuid);
      set({ loading: false, balance });
    } catch (err: any) {
      set({ loading: false, error: err.message || '포인트 잔액 조회 실패' });
    }
  },

  fetchTransactions: async (userUuid, page, size) => {
    set({ loading: true, error: null });
    try {
      const transactions = await fetchPointTransactions(userUuid, page, size);
      set({ loading: false, transactions });
    } catch (err: any) {
      set({ loading: false, error: err.message || '포인트 거래내역 조회 실패' });
    }
  },

  clearPoint: () => {
    set({ balance: 0, transactions: [], loading: false, error: null });
  },
}));
