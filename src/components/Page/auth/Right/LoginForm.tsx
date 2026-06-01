import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import axios from 'axios';

import { useAuthStore } from '@/store/authStore';
import { ShowSuccessToast } from '@/components/Library/Toast/Toast';
import { LoginInput } from './LoginInput';
import { LoginOptions } from './LoginOptions';
import { LoginButton } from './LoginButton';

export const LoginForm = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage('');
    try {
      await login(id, password, rememberMe);
      ShowSuccessToast('로그인 성공!');
      navigate('/');
    } catch (err) {
      console.error('로그인 실패:', err);
      if (axios.isAxiosError(err)) {
        setErrorMessage(err.response?.data?.message ?? '로그인에 실패했습니다.');
      } else {
        setErrorMessage('로그인에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LoginInput
        label="아이디"
        leftIcon={<User className="w-5 h-5" />}
        placeholder="아이디를 입력하세요"
        value={id}
        onChange={(e) => { setId(e.target.value); setErrorMessage(''); }}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
      />
      <LoginInput
        label="비밀번호"
        leftIcon={<Lock className="w-5 h-5" />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        }
        type={showPassword ? 'text' : 'password'}
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
      />
      <LoginOptions rememberMe={rememberMe} onRememberMeChange={setRememberMe} />
      {errorMessage && (
        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
      )}
      <LoginButton onClick={handleLogin} disabled={loading} loading={loading} />
    </div>
  );
};
