interface Props {
  points: number;
}

const UserInfo = ({ points }: Props) => {
  return (
    <div className="flex gap-10 px-10 text-lg">
      <div>
        보유 포인트
        <span className="font-bold text-yellow-500 ml-2">{points.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default UserInfo;
