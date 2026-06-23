import { useState } from 'react';
import { Receipt, ChevronDown } from 'lucide-react';
import type { PurchaseLog } from '@/api/coins';

interface CoinInfoProps {
  history: PurchaseLog[];
}

const formatDate = (iso: string) => {
  if (iso.length < 10) return iso;
  const [, month, day] = iso.slice(0, 10).split('-');
  return `${month}.${day}`;
};

export const CoinInfo = ({ history }: CoinInfoProps) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 pt-4 pb-3 text-left"
      >
        <Receipt size={14} className="text-[#e8d13a]" />
        <p className="text-xs text-gray-500 font-medium">구매 내역</p>
        {history.length > 0 && (
          <span className="text-xs text-gray-400">{history.length}건</span>
        )}
        <ChevronDown
          size={13}
          className={`ml-auto text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div className={`transition-all duration-200 overflow-hidden ${open ? 'max-h-80' : 'max-h-0'}`}>
        <hr className="border-t border-gray-100 mx-4" />
        <div className="p-4 pt-3">
          {history.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">구매 내역이 없습니다.</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
              {history.map((log) => (
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
          )}
        </div>
      </div>
    </div>
  );
};
