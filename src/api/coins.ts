import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string | null;
}

interface CoinsBalanceResponse {
  userUuid?: string;
  totalCoins?: number;
}

export interface PurchaseLog {
  logUuid: string;
  itemUuid: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPoints: number;
  pointsUuid: string;
  createdAt: string;
}

interface PurchasePageResponse {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: PurchaseLog[];
}

// 사용자 구매내역 조회
export const fetchUserCoinPurchases = async (
  userUuid?: string,
  page: number = 0,
  size: number = 20,
): Promise<PurchaseLog[]> => {
  if (!userUuid) return [];
  const res = await axios.get<ApiResponse<PurchasePageResponse>>('/api/trade/transactions', {
    params: { userUuid, page, size },
  });
  return res.data.data?.content ?? [];
};

// 코인 잔액 조회
export const fetchCoinBalance = async (userUuid?: string): Promise<number> => {
  if (!userUuid) return 0;
  const res = await axios.get<ApiResponse<CoinsBalanceResponse>>(`/api/coins/balance/${userUuid}`);
  return res.data.data.totalCoins ?? 0;
};

export interface CartItemResponse {
  cartItemUuid: string;
  itemUuid: string;
  itemName: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  itemActive: boolean;
  addedAt: string;
}

export interface CheckoutResponse {
  itemCount: number;
  totalCoins: number;
  balanceAfter: number;
  items: CartItemResponse[];
}

// 내 카트 조회
export const fetchCart = async (): Promise<CartItemResponse[]> => {
  const res = await axios.get<ApiResponse<CartItemResponse[]>>('/api/trade/cart');
  return res.data.data ?? [];
};

// 카트에 아이템 추가
export const addToCart = async (itemUuid: string, quantity: number = 1): Promise<CartItemResponse> => {
  const res = await axios.post<ApiResponse<CartItemResponse>>('/api/trade/cart', { itemUuid, quantity });
  return res.data.data;
};

// 카트 아이템 삭제
export const removeFromCart = async (cartItemUuid: string): Promise<void> => {
  await axios.delete(`/api/trade/cart/${cartItemUuid}`);
};

// 카트 수량 변경
export const updateCartQuantity = async (
  cartItemUuid: string,
  quantity: number,
): Promise<CartItemResponse> => {
  const res = await axios.patch<ApiResponse<CartItemResponse>>(`/api/trade/cart/${cartItemUuid}`, {
    quantity,
  });
  return res.data.data;
};

// 카트 일괄 결제
export const checkoutCart = async (): Promise<CheckoutResponse> => {
  const res = await axios.post<ApiResponse<CheckoutResponse>>('/api/trade/cart/checkout');
  return res.data.data;
};
