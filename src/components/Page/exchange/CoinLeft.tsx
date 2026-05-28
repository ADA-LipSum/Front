import COIN_IMAGE from '@/assets/COIN.png';

interface CoinInfoProps {
  balance: number;
}

export const CoinLeft = ({ balance }: CoinInfoProps) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 p-5">
      <p className="mb-2 text-xs font-medium tracking-wide text-black uppercase">보유 코인</p>
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold text-yellow-500">{balance.toLocaleString()}</p>
        <img src={COIN_IMAGE} alt="코인" className="h-12 w-12" />
      </div>
    </div>
  );
};
