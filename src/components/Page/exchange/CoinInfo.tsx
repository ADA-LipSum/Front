import { useState } from 'react';
import { Receipt } from 'lucide-react';
import type { PurchaseLog } from '@/api/coins';

interface CoinInfoProps {
  history: PurchaseLog[];
}

const PAGE_SIZE = 5;

const formatDate = (iso: string) => {
  if (iso.length < 10) return iso;
  const [, month, day] = iso.slice(0, 10).split('-');
  return `${month}.${day}`;
};

export const CoinInfo = ({ history }: CoinInfoProps) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = history.slice(0, visibleCount);
  const hasMore = visibleCount < history.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Receipt size={14} className="text-[#e8d13a]" />
        <p className="text-xs text-gray-500 font-medium">구매 내역</p>
        {history.length > 0 && (
          <span className="ml-auto text-xs text-gray-400">{history.length}건</span>
        )}
      </div>
      <hr className="border-t border-gray-100 mb-3" />

      {history.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">구매 내역이 없습니다.</p>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {visible.map((log) => (
              <div
                key={log.logUuid}
                className="flex items-start justify-between text-xs py-2 border-b border-gray-50 last:border-0 gap-2"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-medium text-gray-800 truncate">{log.itemName}</span>
                  <span className="text-gray-400">
                    {log.unitPrice.toLocaleString()}코인 × {log.quantity}개
                  </span>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className="font-semibold text-red-400">
                    -{log.totalPoints.toLocaleString()}
                  </span>
                  <span className="text-gray-400">{formatDate(log.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <button
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="w-full mt-3 text-xs text-gray-500 hover:text-gray-700 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              더보기 ({history.length - visibleCount}개 남음)
            </button>
          )}
        </>
      )}
    </div>
  );
};
