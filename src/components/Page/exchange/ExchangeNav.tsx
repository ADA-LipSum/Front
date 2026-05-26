import { useNavigate } from 'react-router-dom';
import { Coins, Star } from 'lucide-react';

export const ExchangeNav = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs text-gray-500 font-medium mb-3">거래소 이동</p>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => navigate('/exchange/coin')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors bg-[#e8d13a] text-white"
        >
          <Coins size={16} />
          코인 거래소
        </button>
        <button
          onClick={() => navigate('/exchange/point')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors bg-[#7C4DFF] text-white"
        >
          <Star size={16} />
          포인트 거래소
        </button>
      </div>
    </div>
  );
};
