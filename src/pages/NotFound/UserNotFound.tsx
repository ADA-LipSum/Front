import { useNavigate } from 'react-router-dom';

const UserNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <p className="text-8xl font-bold text-green-400">404</p>
      <h1 className="text-2xl font-semibold text-gray-700">존재하지 않는 사용자입니다</h1>
      <button
        onClick={() => navigate('/')}
        className="mt-2 px-6 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-colors"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default UserNotFound;
