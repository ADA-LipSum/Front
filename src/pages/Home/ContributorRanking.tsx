const ContributorRanking = () => {
  const ranks = ["홍길동", "이서준", "김태호", "박민서", "정지원"];

  return (
    <aside className="p-4 bg-white shadow-md lg:w-1/5 rounded-xl h-fit top-8">
      <h2 className="mb-4 text-lg font-bold text-gray-800">🏆 기여자 랭킹</h2>
      <ul className="space-y-3">
        {ranks.map((name, idx) => (
          <li
            key={idx}
            className="flex justify-between text-sm text-gray-700 transition hover:text-indigo-600"
          >
            <span>
              {idx + 1}. {name}
            </span>
            <span className="font-semibold text-indigo-500">
              {Math.floor(Math.random() * 500)}점
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ContributorRanking;
