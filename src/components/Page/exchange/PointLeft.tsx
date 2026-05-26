interface PointInfoProps {
  balance: number;
}

export const PointLeft = ({ balance }: PointInfoProps) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 p-5">
      <p className="mb-2 text-xs font-medium tracking-wide text-black uppercase">보유 포인트</p>
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold text-purple-500 drop-shadow-sm">
          {balance.toLocaleString()}
        </p>
        <img
          src="https://cdn3.emoji.gg/emojis/961317-discord-orbs.png"
          alt="포인트"
          className="h-12 w-12 drop-shadow-md"
        />
      </div>
    </div>
  );
};
