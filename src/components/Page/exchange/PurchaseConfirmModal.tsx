import { AlertCircle, X } from 'lucide-react';
import type { Product } from './ProductCard';

interface PurchaseConfirmModalProps {
  product: Product;
  balance: number;
  onConfirm: () => void;
  onCancel: () => void;
  purchasing: boolean;
  error?: string | null;
  currencyLabel?: string;
}

export const PurchaseConfirmModal = ({
  product,
  balance,
  onConfirm,
  onCancel,
  purchasing,
  error,
  currencyLabel = '포인트',
}: PurchaseConfirmModalProps) => {
  const afterBalance = balance - product.price;
  const canAfford = afterBalance >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl shadow-xl w-80 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-sm font-semibold text-gray-800">구매 확인</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3 px-5 pb-4 border-b border-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-14 h-14 rounded-xl object-contain bg-gray-50 border border-gray-100 p-1 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
            <p className="text-base font-bold text-purple-500 mt-0.5">
              {product.price.toLocaleString()} {currencyLabel}
            </p>
          </div>
        </div>

        <div className="px-5 py-4 flex flex-col gap-2 text-xs">
          <div className="flex justify-between text-gray-500">
            <span>보유 {currencyLabel}</span>
            <span className="font-medium text-gray-700">{balance.toLocaleString()} {currencyLabel}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>구매 금액</span>
            <span className="font-medium text-gray-700">- {product.price.toLocaleString()} {currencyLabel}</span>
          </div>
          <div className="border-t border-gray-100 pt-2 flex justify-between">
            <span className="text-gray-500">구매 후 잔액</span>
            <span className={`font-bold ${canAfford ? 'text-purple-500' : 'text-red-500'}`}>
              {afterBalance.toLocaleString()} {currencyLabel}
            </span>
          </div>
        </div>

        {!canAfford && (
          <div className="mx-5 mb-3 flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500">
            <AlertCircle size={13} className="shrink-0" />
            <span>포인트가 부족합니다.</span>
          </div>
        )}

        {error && (
          <div className="mx-5 mb-3 flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500">
            <AlertCircle size={13} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={!canAfford || purchasing}
            className="flex-1 py-2.5 rounded-xl bg-purple-500 text-white text-sm font-bold hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {purchasing ? '구매 중...' : '구매하기'}
          </button>
        </div>
      </div>
    </div>
  );
};
