import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import { login } from '@/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

import LipSumIcon from '@/assets/LipSum_icon.svg';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useState } from 'react';

export const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await dispatch(login({ id, password })).unwrap();
      alert('로그인 성공!');
      navigate('/');
    } catch (err) {
      alert('로그인 실패');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* 로고 */}
      <Link to="/">
        <img src={LipSumIcon} alt="LipSum Logo" className="w-16" />
      </Link>

      {/* 타이틀 */}
      <h1 className="mt-5 text-5xl font-extrabold">
        Welcome to <span className="text-green-600">LipSum!</span>
      </h1>

      {/* 설명 */}
      <p className="mt-5 font-bold">LipSum은 학생들이 지식을 공유하며 소통하는 플랫폼입니다.</p>

      {/* 로그인 영역 */}
      <div className="w-full max-w-md mt-10">
        {/* 구분선 */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-0.75 bg-[#535353]"></div>
          <span className="text-[#535353] font-bold">로그인</span>
          <div className="flex-1 h-0.75 bg-[#535353]"></div>
        </div>

        {/* 아이디 */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">아이디</label>
          <input
            type="text"
            onChange={(e) => setId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* 비밀번호 */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium mb-2">비밀번호</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Eye className="absolute right-3 top-11 w-5 h-5 text-black cursor-pointer" />
        </div>

        {/* 로그인 유지 + 소셜 링크 */}
        <div className="flex justify-between items-center mb-6">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" />
            로그인 상태유지
          </label>

          <Link to="/social-login" className="text-sm text-blue-500 hover:underline">
            소셜 계정이 있으신가요?
          </Link>
        </div>

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
          로그인
        </button>
      </div>
    </div>
  );
};
