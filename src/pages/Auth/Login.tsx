import { useEffect } from "react";
import Design from "./LoginRight";
import LoginLeft from "./LoginLeft";

export default function Login() {
  useEffect(() => {
    document.body.style.overflow = "hidden"; // 스크롤 안되게 막음
    return () => {
      document.body.style.overflow = "auto"; // 원래대로 돌려놓음
    };
  }, []);
  return (
    <div className="flex w-full h-screen">
      <LoginLeft /> {/* 로그인 폼 왼쪽 부분 */}
      <Design /> {/* 디자인 테스트 영역 오른쪽 부분 */}
    </div>
  );
}
