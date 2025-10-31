const LatestPosts = () => {
    const posts = [
        '오늘 수업 후기 공유합니다!',
        'Spring Boot 설정 오류 해결 방법',
        '스터디 참여하실 분?',
        '좋은 개발 블로그 추천',
        'SQL JOIN 정리',
    ];

    return (
        <aside className="lg:w-1/5 bg-white rounded-xl shadow-md p-4 h-fit sticky top-8">
            <h2 className="font-bold text-lg mb-4 text-gray-800">📢 최신 글</h2>
            <ul className="space-y-3">
                {posts.map((title, idx) => (
                    <li
                        key={idx}
                        className="text-sm text-gray-700 border-b pb-2 hover:text-indigo-600 cursor-pointer transition"
                    >
                        {title}
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default LatestPosts;
