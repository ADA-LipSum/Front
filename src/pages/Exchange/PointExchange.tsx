import { useState, useMemo, useEffect } from 'react';
import { SearchBar } from '@/components/Page/exchange/SearchBar';
import { ExchangeNav } from '@/components/Page/exchange/ExchangeNav';
import type { Product } from '@/components/Page/exchange/ProductCard';
import { PointLeft } from '@/components/Page/exchange/PointLeft';
import { PointInfo } from '@/components/Page/exchange/PointInfo';
import type { PaymentRecord } from '@/components/Page/exchange/PointInfo';
import { StickerList } from '@/components/Page/exchange/StickerList';
import { BannerList } from '@/components/Page/exchange/BannerList';
import { PurchaseConfirmModal } from '@/components/Page/exchange/PurchaseConfirmModal';
import { useAuthStore } from '@/store/authStore';
import { usePointStore } from '@/store/pointStore';
import { purchaseWithPoints } from '@/api/exchange';
import { toast } from 'react-toastify';

const toPaymentRecord = (tx: Record<string, any>): PaymentRecord => {
  const changeType: string = (tx.changeType ?? tx.type ?? '').toUpperCase();
  const type: PaymentRecord['type'] =
    changeType === 'GAIN' ? '획득' : changeType === 'LOSS' ? '차감' : '사용';
  const amount: number = Math.abs(tx.points ?? tx.amount ?? 0);
  const source: string = tx.description ?? changeType;
  const rawDate: string = tx.createdAt ?? tx.date ?? '';
  const dateStr = rawDate.length >= 10 ? rawDate.slice(5, 10).replace('-', '.') : rawDate;
  return {
    id: String(tx.pointsUuid ?? tx.id ?? Math.random()),
    type,
    amount,
    source,
    date: dateStr,
  };
};

export const PointExchange = () => {
  const userUuid = useAuthStore((s) => s.user?.uuid);
  const { balance, transactions, fetchBalance, fetchTransactions } = usePointStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'sticker' | 'banner'>('sticker');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  useEffect(() => {
    if (!userUuid) return;
    fetchBalance(userUuid);
    fetchTransactions(userUuid);
  }, [userUuid]);

  const history = useMemo<PaymentRecord[]>(() => transactions.map(toPaymentRecord), [transactions]);

  const handleBuyNow = (product: Product) => {
    setPurchaseError(null);
    setSelectedProduct(product);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedProduct) return;
    setPurchasing(true);
    setPurchaseError(null);
    try {
      await purchaseWithPoints(selectedProduct.id, 1);
      toast.success('구매가 완료되었습니다!');
      setSelectedProduct(null);
      if (userUuid) {
        fetchBalance(userUuid);
        fetchTransactions(userUuid);
      }
    } catch (err: any) {
      setPurchaseError(err.message || '구매에 실패했습니다.');
    } finally {
      setPurchasing(false);
    }
    setSelectedProduct(null);
    setPurchaseError(null);
  };

  function handleCloseModal(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-[#E0E0E0] w-full py-20 bg-purple-500"></div>

      <div className="flex gap-6 px-5 py-6 max-w-7xl mx-auto">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('sticker')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'sticker'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              스티커
            </button>
            <button
              onClick={() => setActiveTab('banner')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'banner'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              배너
            </button>
          </div>

          {activeTab === 'sticker' ? (
            <StickerList
              searchQuery={searchQuery}
              cartProductIds={[]}
              onAddToCart={handleBuyNow}
              currencyLabel="포인트"
            />
          ) : (
            <BannerList
              searchQuery={searchQuery}
              cartProductIds={[]}
              onAddToCart={handleBuyNow}
              currencyLabel="포인트"
            />
          )}
        </div>

        <div className="w-72 shrink-0 flex flex-col gap-4">
          <PointLeft balance={balance} />
          <ExchangeNav />
          <PointInfo history={history} />
        </div>
      </div>

      {selectedProduct && (
        <PurchaseConfirmModal
          product={selectedProduct}
          balance={balance}
          onConfirm={handleConfirmPurchase}
          onCancel={handleCloseModal}
          purchasing={purchasing}
          error={purchaseError}
          currencyLabel="포인트"
        />
      )}
    </div>
  );
};
