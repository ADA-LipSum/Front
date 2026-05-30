import { useAuthStore } from '@/store/authStore';
import { ShowErrorToast, ShowSuccessToast } from '@/components/Library/Toast/Toast';

export const Main = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
      ShowSuccessToast('로그아웃 성공!');
    } catch (err) {
      ShowErrorToast('로그아웃 실패');
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <p>로그인 상태입니다.</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <div>로그인 상태가 아닙니다.</div>
      )}
    </div>
  );
};
