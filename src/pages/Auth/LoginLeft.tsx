import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useAuth } from '@/auth/AuthContext';

const LoginLeft = () => {
  const { user, authLoading } = useAuth();

  const hasCheckedInitial = useRef(false);

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // ← 이걸로만 관리
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleToggle = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);

    const ok = await login(id, password);

    setLoading(false);
    if (ok) {
      navigate('/'); // 성공 시 홈으로
    } else {
      setErr('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (!authLoading) {
      // 최초 진입 시 1번만 검사
      if (!hasCheckedInitial.current) {
        hasCheckedInitial.current = true;

        if (user) {
          alert('이미 로그인되어 있습니다.');
          navigate('/');
        }
      }
    }
  }, [authLoading, user, navigate]);

  if (authLoading) return null;

  if (user) return null;

  return (
    <div className="w-[480px] h-screen bg-gray-200">
      <div className="flex items-center justify-center">
        <form onSubmit={handleSubmit}>
          <img src="/src/assets/LipSum.svg" className="w-24 mx-auto mb-8 m-25" alt="LipSum Logo" />

          <label className="block mb-2 text-sm font-medium" htmlFor="id">
            아이디
          </label>
          <input
            type="text"
            id="id"
            value={id}
            onChange={e => setId(e.target.value)}
            className="w-full p-2 mb-4 bg-white border border-white rounded-2xl focus:outline-none focus:ring-0 focus:border-transparent"
            required
            autoComplete="username"
          />

          <label className="block mb-2 text-sm font-medium" htmlFor="password">
            비밀번호
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 pr-10 bg-white border border-white rounded-2xl focus:outline-none focus:ring-0 focus:border-transparent"
              required
              autoComplete="current-password"
            />

            <button
              type="button"
              onClick={handleToggle}
              className="absolute inset-y-0 flex items-center text-gray-500 right-3"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 mt-10 text-white bg-blue-500 rounded disabled:opacity-50"
          >
            {loading ? '로딩 중...' : '로그인'}
          </button>
          {err && <p className="text-sm text-red-500">{err}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginLeft;
