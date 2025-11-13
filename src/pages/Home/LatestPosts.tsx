const LatestPosts = () => {
  const posts = [
    "오늘 수업 후기 공유합니다!",
    "Spring Boot 설정 오류 해결 방법",
    "스터디 참여하실 분?",
    "좋은 개발 블로그 추천",
    "SQL JOIN 정리",
  ];

  return (
    <aside className="p-4 bg-white shadow-md lg:w-1/5 rounded-xl h-fit top-8">
      <h2 className="mb-4 text-lg font-bold text-gray-800">📢 최신 글</h2>
      <ul className="space-y-3">
        {posts.map((title, idx) => (
          <li
            key={idx}
            className="pb-2 text-sm text-gray-700 transition border-b cursor-pointer hover:text-indigo-600"
          >
            {title}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default LatestPosts;
