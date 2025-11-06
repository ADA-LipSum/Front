import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded shadow-md w-80"
      >
        <h2 className="mb-4 text-lg font-bold">회원가입</h2>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium" htmlFor="email">
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium" htmlFor="password">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Login;
