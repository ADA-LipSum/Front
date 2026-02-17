import LipSumIcon from '@/assets/LipSum_icon.svg';
import { Link } from 'react-router-dom';

export const SocialLogin = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* 로고 */}
      <Link to="/" className="mb-6">
        <img src={LipSumIcon} alt="LipSum Logo" className="w-16" />
      </Link>

      {/* 타이틀 */}
      <h1 className="text-5xl font-extrabold">
        Welcome to <span className="text-green-600">LipSum!</span>
      </h1>

      {/* 설명 */}
      <p className="mt-4 text-gray-600 text-base">
        LipSum은 학생들이 지식을 공유하며 소통하는 플랫폼입니다.
      </p>

      {/* 로그인 구분선 */}
      <div className="w-full max-w-md mt-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-gray-400"></div>
          <span className="text-gray-600 font-semibold text-sm">로그인</span>
          <div className="flex-1 h-px bg-gray-400"></div>
        </div>

        {/* 소셜 로그인 영역 */}
        <div className="flex justify-center gap-20 mb-12">
          {/* GitHub */}
          <div className="flex flex-col items-center cursor-pointer">
            <div className="w-24 h-24 rounded-full flex items-center justify-center">
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                alt="GitHub"
                className="w-24"
              />
            </div>
            <span className="mt-4 font-semibold text-lg">GitHub</span>
          </div>

          {/* Google */}
          <div className="flex flex-col items-center cursor-pointer">
            <div className="w-24 h-24 rounded-full flex items-center justify-center">
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google"
                className="w-24"
              />
            </div>
            <span className="mt-4 font-semibold text-lg">Google</span>
          </div>
        </div>

        {/* 하단 구분선 */}
        <div className="h-px bg-gray-400 mb-6"></div>

        {/* 일반 로그인 이동 */}
        <div className="text-center">
          <Link to="/login" className="text-blue-500 hover:underline text-sm">
            일반 계정이 있으신가요?
          </Link>
        </div>
      </div>
    </div>
  );
};
