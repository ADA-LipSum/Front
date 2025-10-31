const ContributorRanking = () => {
    const ranks = ['홍길동', '이서준', '김태호', '박민서', '정지원'];

    return (
        <aside className="lg:w-1/5 bg-white rounded-xl shadow-md p-4 h-fit sticky top-8">
            <h2 className="font-bold text-lg mb-4 text-gray-800">🏆 기여자 랭킹</h2>
            <ul className="space-y-3">
                {ranks.map((name, idx) => (
                    <li
                        key={idx}
                        className="flex justify-between text-sm text-gray-700 hover:text-indigo-600 transition"
                    >
                        <span>
                            {idx + 1}. {name}
                        </span>
                        <span className="text-indigo-500 font-semibold">{Math.floor(Math.random() * 500)}점</span>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default ContributorRanking;
