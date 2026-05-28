import { useState } from 'react';

export interface PaymentRecord {
  id: string;
  type: '획득' | '사용' | '차감';
  amount: number;
  source: string;
  date: string;
}

interface PointInfoProps {
  history: PaymentRecord[];
}

const PAGE_SIZE = 5;

const TYPE_STYLE = {
  획득: {
    badge: 'bg-emerald-50 text-emerald-600',
    amount: 'text-emerald-500',
    prefix: '+',
  },
  사용: {
    badge: 'bg-purple-50 text-purple-500',
    amount: 'text-purple-500',
    prefix: '-',
  },
  차감: {
    badge: 'bg-red-50 text-red-500',
    amount: 'text-red-500',
    prefix: '-',
  },
} as const;

export const PointInfo = ({ history }: PointInfoProps) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleHistory = history.slice(0, visibleCount);
  const hasMore = visibleCount < history.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs text-gray-500 font-medium mb-2">거래 내역</p>
      <hr className="border-t border-gray-200 mb-2" />
      <div className="flex flex-col">
        {visibleHistory.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">거래 내역이 없습니다.</p>
        )}
        {visibleHistory.map((record) => {
          const style = TYPE_STYLE[record.type];
          return (
            <div
              key={record.id}
              className="flex flex-col gap-1 py-2.5 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`font-bold text-sm shrink-0 ${style.amount}`}>
                  {style.prefix}
                  {record.amount.toLocaleString()}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${style.badge}`}
                  >
                    {record.type}
                  </span>
                  <span className="text-[11px] text-gray-400">{record.date}</span>
                </div>
              </div>
              <span className="text-xs text-gray-500 leading-tight break-keep">
                {record.source}
              </span>
            </div>
          );
        })}
      </div>
      {hasMore && (
        <button
          onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
          className="w-full mt-2 text-xs text-gray-500 hover:text-gray-700 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          더보기 ({history.length - visibleCount}개 남음)
        </button>
      )}
    </div>
  );
};
