import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { fetchInventoryList, patchInventoryBanner } from '@/api/inventory';

interface BannerItem {
  inventoryUuid: string;
  itemName: string;
  imageUrl: string;
}

interface SetBannerModalProps {
  userUuid: string;
  onClose: () => void;
  onTempSelect: (imageUrl: string) => void;
  onSaved: () => void;
}

export const SetBannerModal = ({
  userUuid,
  onClose,
  onTempSelect,
  onSaved,
}: SetBannerModalProps) => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [selectedInventoryUuid, setSelectedInventoryUuid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const items = await fetchInventoryList(userUuid);
        setBanners(
          items
            .filter((item) => item.subCategory === 'BANNER')
            .map(({ inventoryUuid, itemName, imageUrl }) => ({
              inventoryUuid,
              itemName,
              imageUrl,
            })),
        );
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [userUuid]);

  const handleSelect = async (item: BannerItem) => {
    if (isSaving) return;
    setSelectedInventoryUuid(item.inventoryUuid);
    onTempSelect(item.imageUrl);
    setIsSaving(true);
    try {
      await patchInventoryBanner(userUuid, item.inventoryUuid);
      onSaved();
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-white rounded-xl shadow-xl flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <p className="font-semibold">프로필 배경 선택</p>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* 배너 목록 */}
        <div className="p-5 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
              불러오는 중...
            </div>
          ) : banners.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
              보유한 배너가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {banners.map((banner) => {
                const isSelected = selectedInventoryUuid === banner.inventoryUuid;
                return (
                  <div
                    key={banner.inventoryUuid}
                    className="relative border border-gray-300 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleSelect(banner)}
                  >
                    <img
                      src={banner.imageUrl}
                      alt={banner.itemName}
                      className={`w-full h-40 object-cover transition-all duration-200 ${isSelected ? 'brightness-50' : 'hover:brightness-75'}`}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="text-white w-10 h-10" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>


      </div>
    </div>
  );
};
