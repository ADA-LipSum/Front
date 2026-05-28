import { useState } from 'react';

export interface PaymentRecord {
  id: string;
  type: '획득' | '사용';
  amount: number;
  source: string;
  date: string;
}

interface PointInfoProps {
  history: PaymentRecord[];
}

const PAGE_SIZE = 5;

export const PointInfo = ({ history }: PointInfoProps) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleHistory = history.slice(0, visibleCount);
  const hasMore = visibleCount < history.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div>
        <p className="text-xs text-gray-500 font-medium mb-2">거래 내역</p>
        <hr className="border-t border-gray-200 mb-2" />
        <div className="flex flex-col gap-2">
          {visibleHistory.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-2">거래 내역이 없습니다.</p>
          )}
          {visibleHistory.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-gray-600 truncate max-w-27.5">{record.source}</span>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span
                  className={`font-semibold ${record.type === '획득' ? 'text-emerald-500' : 'text-red-400'}`}
                >
                  {record.type === '획득' ? '+' : '-'}
                  {record.amount.toLocaleString()}
                </span>
                <span className="text-gray-400">{record.date}</span>
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
      </div>
    </div>
  );
};
