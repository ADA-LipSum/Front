import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  fetchCoinBalance,
  fetchUserCoinPurchases,
  fetchCart as apiFetchCart,
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
  updateCartQuantity as apiUpdateCartQuantity,
  checkoutCart as apiCheckoutCart,
} from '@/api/coins';
import type { PurchaseLog, CartItemResponse } from '@/api/coins';

interface CoinStore {
  balance: number;
  purchases: PurchaseLog[];
  loading: boolean;
  error: string | null;

  cartItems: CartItemResponse[];
  cartLoading: boolean;
  cartError: string | null;

  fetchBalance: (userUuid: string) => Promise<void>;
  fetchPurchases: (userUuid: string, page?: number, size?: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  addToCart: (itemUuid: string, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemUuid: string) => Promise<void>;
  updateCartQuantity: (cartItemUuid: string, quantity: number) => Promise<void>;
  checkout: () => Promise<boolean>;
  clearCoin: () => void;
}

export const useCoinStore = create<CoinStore>()(
  persist(
    (set) => ({
      balance: 0,
      purchases: [],
      loading: false,
      error: null,

      cartItems: [],
      cartLoading: false,
      cartError: null,

      fetchBalance: async (userUuid) => {
        set({ loading: true, error: null });
        try {
          const balance = await fetchCoinBalance(userUuid);
          set({ loading: false, balance });
        } catch (err: any) {
          set({ loading: false, error: err.response?.data?.message || '코인 잔액 조회 실패' });
        }
      },

      fetchPurchases: async (userUuid, page, size) => {
        set({ loading: true, error: null });
        try {
          const purchases = await fetchUserCoinPurchases(userUuid, page, size);
          set({ loading: false, purchases });
        } catch (err: any) {
          set({ loading: false, error: err.response?.data?.message || '코인 구매내역 조회 실패' });
        }
      },

      fetchCart: async () => {
        set({ cartLoading: true, cartError: null });
        try {
          const cartItems = await apiFetchCart();
          set({ cartLoading: false, cartItems });
        } catch (err: any) {
          set({ cartLoading: false, cartError: err.response?.data?.message || '카트 조회 실패' });
        }
      },

      addToCart: async (itemUuid, quantity = 1) => {
        set({ cartLoading: true, cartError: null });
        try {
          const newItem = await apiAddToCart(itemUuid, quantity);
          set((state) => {
            const exists = state.cartItems.find((i) => i.cartItemUuid === newItem.cartItemUuid);
            const cartItems = exists
              ? state.cartItems.map((i) => (i.cartItemUuid === newItem.cartItemUuid ? newItem : i))
              : [...state.cartItems, newItem];
            return { cartLoading: false, cartItems };
          });
        } catch (err: any) {
          set({ cartLoading: false, cartError: err.response?.data?.message || '카트 추가 실패' });
        }
      },

      removeFromCart: async (cartItemUuid) => {
        set({ cartLoading: true, cartError: null });
        try {
          await apiRemoveFromCart(cartItemUuid);
          set((state) => ({
            cartLoading: false,
            cartItems: state.cartItems.filter((i) => i.cartItemUuid !== cartItemUuid),
          }));
        } catch (err: any) {
          set({ cartLoading: false, cartError: err.response?.data?.message || '카트 삭제 실패' });
        }
      },

      updateCartQuantity: async (cartItemUuid, quantity) => {
        set({ cartLoading: true, cartError: null });
        try {
          const updated = await apiUpdateCartQuantity(cartItemUuid, quantity);
          set((state) => ({
            cartLoading: false,
            cartItems: state.cartItems.map((i) =>
              i.cartItemUuid === cartItemUuid ? updated : i,
            ),
          }));
        } catch (err: any) {
          set({ cartLoading: false, cartError: err.response?.data?.message || '수량 변경 실패' });
        }
      },

      checkout: async () => {
        set({ cartLoading: true, cartError: null });
        try {
          const result = await apiCheckoutCart();
          set({ cartLoading: false, cartItems: [], balance: result.balanceAfter });
          return true;
        } catch (err: any) {
          const message: string = err.response?.data?.message || '결제 실패';
          // 재고 부족/비활성 아이템이 로컬 카트에 있으면 제거해 다음 결제를 허용
          set((state) => {
            const filtered = state.cartItems.filter(
              (i) => !message.includes(i.itemName),
            );
            return { cartLoading: false, cartError: message, cartItems: filtered };
          });
          return false;
        }
      },

      clearCoin: () => {
        set({ balance: 0, purchases: [], loading: false, error: null, cartItems: [], cartLoading: false, cartError: null });
      },
    }),
    {
      name: 'coin-store',
      storage: createJSONStorage(() => sessionStorage),
      // cartItems만 세션 동안 유지, 나머지 휘발성 상태는 제외
      partialize: (state) => ({ cartItems: state.cartItems }),
    },
  ),
);
