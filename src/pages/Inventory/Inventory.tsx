import { useState, useEffect } from 'react';
import { fetchInventoryList } from '@/api/inventory';
import { useAuthStore } from '@/store/authStore';
import { InventoryItemCard } from '@/components/Page/inventory/InventoryItemCard';
import { InventoryBannerCard } from '@/components/Page/inventory/InventoryBannerCard';
import type { InventoryItem } from '@/components/Page/inventory/InventoryItemCard';

type Tab = 'sticker' | 'banner';

export const Inventory = () => {
  const userUuid = useAuthStore((s) => s.user?.uuid);
  const [activeTab, setActiveTab] = useState<Tab>('sticker');
  const [stickers, setStickers] = useState<InventoryItem[]>([]);
  const [banners, setBanners] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userUuid) return;
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const items = await fetchInventoryList(userUuid);
        setStickers(items.filter((item) => item.subCategory === 'STICKER'));
        setBanners(items.filter((item) => item.subCategory === 'BANNER'));
      } catch (err: any) {
        setError(err.message || '인벤토리 불러오기 실패');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [userUuid]);

  const currentItems = activeTab === 'sticker' ? stickers : banners;

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="max-w-350 mx-auto px-10 py-10">
        <h1 className="text-2xl font-bold mb-6">인벤토리</h1>

        <div className="flex gap-1 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('sticker')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === 'sticker'
                ? 'border-[#e8d13a] text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            스티커 {!loading && `(${stickers.length})`}
          </button>
          <button
            onClick={() => setActiveTab('banner')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === 'banner'
                ? 'border-[#e8d13a] text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            배너 {!loading && `(${banners.length})`}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48 text-gray-400 text-sm">
            불러오는 중...
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-48 text-red-400 text-sm">
            {error}
          </div>
        ) : currentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-sm">
              보유한 {activeTab === 'sticker' ? '스티커' : '배너'}가 없습니다.
            </p>
          </div>
        ) : activeTab === 'sticker' ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {stickers.map((item) => (
              <InventoryItemCard key={item.inventoryUuid} item={item} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {banners.map((item) => (
              <InventoryBannerCard key={item.inventoryUuid} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
