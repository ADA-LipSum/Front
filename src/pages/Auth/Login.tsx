import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../auth/AuthContext';

const Login = () => {
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md w-80">
        <h2 className="mb-4 text-lg font-bold text-center">로그인</h2>

        {/* 아이디 */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium" htmlFor="id">
            아이디
          </label>
          <input
            type="text"
            id="id"
            value={id}
            onChange={e => setId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
            autoComplete="username"
          />
        </div>

        {/* 비밀번호 + 아이콘 */}
        <div className="relative mb-4">
          <label className="block mb-1 text-sm font-medium" htmlFor="password">
            비밀번호
          </label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 rounded"
              required
              autoComplete="current-password"
            />

            {/* 👇 input 기준으로 세로 중앙 고정 */}
            <button
              type="button"
              onClick={handleToggle}
              className="absolute inset-y-0 flex items-center text-gray-500 right-3"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {err && <p className="mt-1 text-sm text-red-600">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? '로그인 중…' : '로그인'}
        </button>
      </form>
    </div>
  );
};

export default Login;
