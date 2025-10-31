const ChannelSection = () => {
    const posts = [
        '이번 주 스터디 모임 공지합니다.',
        'React 상태관리 어떤 걸 쓰면 좋을까요?',
        'Java 실습에서 질문 있습니다!',
        'Next.js 15에서 app router 오류 질문',
        '학원 근처 맛집 추천해요!',
    ];

    return (
        <section className="bg-white rounded-2xl shadow-md p-4">
            <h2 className="text-lg font-bold mb-4 text-gray-800">📌 채널</h2>

            <div className="flex gap-3 mb-5">
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-md shadow hover:bg-indigo-600 transition">
                    일반 채널
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">
                    개발 채널
                </button>
            </div>

            <ul className="divide-y divide-gray-200">
                {posts.map((title, idx) => (
                    <li key={idx} className="p-3 hover:bg-gray-50 cursor-pointer transition-colors text-gray-700">
                        {title}
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default ChannelSection;
