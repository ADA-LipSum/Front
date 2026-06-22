import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, AlertCircle, ChevronDown } from 'lucide-react';
import type { Product } from './ProductCard';

export interface CartItem {
  cartItemUuid: string;
  product: Product;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  coinBalance: number;
  onQuantityChange: (cartItemUuid: string, newQuantity: number) => void;
  onRemove: (cartItemUuid: string) => void;
  onPurchase: () => void;
  purchasing?: boolean;
  error?: string | null;
  currencyLabel?: string;
}

export const Cart = ({
  items,
  coinBalance,
  onQuantityChange,
  onRemove,
  onPurchase,
  purchasing,
  error,
  currencyLabel = '코인',
}: CartProps) => {
  const [open, setOpen] = useState(true);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const afterBalance = coinBalance - totalPrice;

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 pt-4 pb-3 text-left"
      >
        <ShoppingCart size={16} className="text-[#e8d13a]" />
        <p className="text-xs text-gray-500 font-medium">장바구니</p>
        {items.length > 0 && (
          <span className="bg-[#e8d13a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {items.length}
          </span>
        )}
        <ChevronDown
          size={13}
          className={`ml-auto text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div className={`transition-all duration-200 overflow-hidden ${open ? 'max-h-125' : 'max-h-0'}`}>
      <div className="px-4 pb-4 flex flex-col gap-3">
      {items.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">장바구니가 비어있습니다.</p>
      ) : (
        <>
          <div className="flex flex-col gap-1 max-h-56 overflow-y-auto">
            {items.map(({ cartItemUuid, product, quantity }) => (
              <div
                key={cartItemUuid}
                className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{product.name}</p>
                  <p className="text-xs text-[#e8d13a] font-bold">
                    {(product.price * quantity).toLocaleString()} {currencyLabel}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onQuantityChange(cartItemUuid, quantity - 1)}
                    className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                  >
                    <Minus size={10} />
                  </button>
                  <span className="text-xs w-5 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => onQuantityChange(cartItemUuid, quantity + 1)}
                    className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                  >
                    <Plus size={10} />
                  </button>
                  <button
                    onClick={() => onRemove(cartItemUuid)}
                    className="w-5 h-5 rounded bg-red-50 flex items-center justify-center hover:bg-red-100 text-red-400 ml-1"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>총 금액</span>
              <span className="font-bold text-gray-800">{totalPrice.toLocaleString()} {currencyLabel}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>보유 {currencyLabel}</span>
              <span>{coinBalance.toLocaleString()} {currencyLabel}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>결제 후 잔액</span>
              <span
                className={`font-bold ${afterBalance < 0 ? 'text-red-500' : 'text-emerald-500'}`}
              >
                {afterBalance.toLocaleString()} {currencyLabel}
              </span>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500">
              <AlertCircle size={13} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={onPurchase}
            disabled={afterBalance < 0 || purchasing}
            className="w-full py-2.5 rounded-lg bg-[#e8d13a] text-white text-sm font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {purchasing ? '결제 중...' : '구매하기'}
          </button>
        </>
      )}
      </div>
      </div>
    </div>
  );
};
