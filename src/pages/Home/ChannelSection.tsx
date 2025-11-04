import { useMemo, useState } from "react";

type Channel = "general" | "dev";

const ChannelSection = () => {
  // 1) 현재 선택된 채널
  const [active, setActive] = useState<Channel>("general");

  // 2) 채널 정보를 가진 글 목록
  const posts = [
    {
      id: 1,
      title: "이번 주 스터디 모임 공지합니다.",
      channel: "general" as Channel,
    },
    {
      id: 2,
      title: "React 상태관리 어떤 걸 쓰면 좋을까요?",
      channel: "dev" as Channel,
    },
    { id: 3, title: "Java 실습에서 질문 있습니다!", channel: "dev" as Channel },
    {
      id: 4,
      title: "Next.js 15에서 app router 오류 질문",
      channel: "dev" as Channel,
    },
    { id: 5, title: "학원 근처 맛집 추천해요!", channel: "general" as Channel },
  ];

  // 3) 선택된 채널에 맞게 필터링
  const filtered = useMemo(
    () => posts.filter((p) => p.channel === active),
    [active]
  );

  // 4) 버튼 공통 클래스 + 활성화 클래스
  const baseBtn =
    "px-4 py-2 rounded-md transition shadow focus:outline-none focus:ring-2 focus:ring-offset-2";
  const activeBtn = "bg-indigo-500 text-white hover:bg-indigo-600";
  const inactiveBtn = "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return (
    <section className="p-4 bg-white shadow-md rounded-2xl">
      <h2 className="mb-4 text-lg font-bold text-gray-800">📌 채널</h2>

      <div className="flex gap-3 mb-5" role="tablist" aria-label="채널 선택">
        <button
          role="tab"
          aria-selected={active === "general"}
          className={`${baseBtn} ${active === "general" ? activeBtn : inactiveBtn}`}
          onClick={() => setActive("general")}
        >
          일반 채널
        </button>

        <button
          role="tab"
          aria-selected={active === "dev"}
          className={`${baseBtn} ${active === "dev" ? activeBtn : inactiveBtn}`}
          onClick={() => setActive("dev")}
        >
          개발 채널
        </button>
      </div>

      <ul className="divide-y divide-gray-200">
        {filtered.length === 0 ? (
          <li className="p-3 text-gray-500">이 채널에 아직 글이 없어요.</li>
        ) : (
          filtered.map((post) => (
            <li
              key={post.id}
              className="p-3 text-gray-700 transition-colors cursor-pointer hover:bg-gray-50"
            >
              {post.title}
            </li>
          ))
        )}
      </ul>
    </section>
  );
};

export default ChannelSection;
