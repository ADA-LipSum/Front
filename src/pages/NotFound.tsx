import { useEffect, useRef, useState } from "react";

const EGG_IMAGE_URL = "https://cdn3.emoji.gg/emojis/3416-rickroll.gif"; // <- 여기에 이미지 경로

export default function NotFound() {
  // 이스터에그 on/off
  const [eggVisible, setEggVisible] = useState(false);
  // 위치 상태 (px)
  const [pos, setPos] = useState({ x: 120, y: 120 });
  const bufferRef = useRef("");
  const timerRef = useRef<number | null>(null);

  // 키 시퀀스 감지: "rick" (대소문자 무시)
  useEffect(() => {
    const TARGET = "rick";
    const onKeyDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const isTypingField =
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          (el as HTMLElement).isContentEditable);

      if (isTypingField) return; // 입력 필드에서는 감지 X

      // ESC로 이스터에그 닫기
      if (e.key === "Escape") {
        setEggVisible(false);
        bufferRef.current = "";
        return;
      }

      // 문자 키만 기록
      if (e.key.length === 1) {
        bufferRef.current = (bufferRef.current + e.key.toLowerCase()).slice(
          -TARGET.length
        );
        if (bufferRef.current === TARGET) {
          setEggVisible(true);
          // 버퍼 초기화 (연타 시 중복 트리거 방지)
          bufferRef.current = "";
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // 이미지 프리로드
  useEffect(() => {
    const img = new Image();
    img.src = EGG_IMAGE_URL;
  }, []);

  // 떠다니는(랜덤 워크) 애니메이션
  useEffect(() => {
    if (!eggVisible) {
      // 보이지 않을 땐 타이머 제거
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const moveRandom = () => {
      const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      const vh = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
      );

      const IMG_W = 96; // 이미지 폭 예상치(px) — Tailwind w-24 기준
      const IMG_H = 96; // 이미지 높이 예상치(px)
      const margin = 16;

      const x = Math.floor(Math.random() * (vw - IMG_W - margin * 2) + margin);
      const y = Math.floor(Math.random() * (vh - IMG_H - margin * 2) + margin);

      setPos({ x, y });
    };

    // 시작 시 한 번 이동하고 주기적으로 이동
    moveRandom();
    timerRef.current = window.setInterval(moveRandom, 2500);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [eggVisible]);

  return (
    <main className="grid min-h-full px-6 py-24 place-items-center sm:py-32 lg:px-8">
      <div className="text-center">
        <h1 className="text-5xl font-semibold text-indigo-400">404</h1>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-black text-balance sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-lg font-medium text-gray-400 text-pretty sm:text-xl/8">
          죄송합니다. 페이지를 찾을 수 없습니다.
        </p>
        <div className="flex items-center justify-center mt-10 gap-x-6">
          <a
            href="/"
            className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            홈으로 돌아가기
          </a>
          <a href="/contact" className="text-sm font-semibold text-black">
            문의하기 <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>

      {/* 이스터에그: "rick" 입력 시 표시 */}
      {eggVisible && (
        <>
          {/* 스크린리더 안내용 (모션 민감 사용자 배려) */}
          <div className="sr-only" aria-live="polite">
            이스터에그가 활성화되었습니다. ESC를 누르면 닫힙니다.
          </div>
          <button
            type="button"
            onClick={() =>
              alert("Never gonna give you up, never gonna let you down...")
            }
          >
            <img
              src={EGG_IMAGE_URL}
              alt="Hoya76 Easter Egg"
              style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                // 중심 정렬 & 부드러운 이동
                transform: "translate(-50%, -50%)",
                transition: "left 900ms ease, top 900ms ease",
                width: "96px",
                height: "96px",
                zIndex: 50,
                pointerEvents: "none", // 클릭 방해 X
              }}
              className="select-none opacity-90 hover:opacity-100"
            />
          </button>
        </>
      )}
    </main>
  );
}
