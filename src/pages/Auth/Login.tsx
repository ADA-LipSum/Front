// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.tsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');

    const ok = await login(email, password);
    if (ok) {
      navigate('/'); // 성공 시 홈으로
    } else {
      setErr('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md w-80">
        <h2 className="mb-4 text-lg font-bold">로그인</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium" htmlFor="email">
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block mb-1 text-sm font-medium" htmlFor="password">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {err && <p className="mt-1 text-sm text-red-600">{err}</p>}

        <button
          type="submit"
          className="w-full py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          로그인
        </button>
      </form>
    </div>
  );
};

export default Login;
