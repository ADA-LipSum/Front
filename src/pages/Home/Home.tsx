import { login } from '../../api/auth';
import { useState } from 'react';

export const Home = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const data = await login(id, password);
      console.log('✅ 로그인 성공:', data);
    } catch (error: any) {
      console.log('❌ 로그인 실패:', error.response?.data || error.message);
    }
  };
  return (
    <div>
      <div style={{ padding: '20px' }}>
        <h2>Login Test</h2>

        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={{ display: 'block', marginBottom: '10px' }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', marginBottom: '10px' }}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};
