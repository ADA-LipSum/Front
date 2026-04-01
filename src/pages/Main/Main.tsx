import type { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAsync } from '@/features/auth/authSlice';
import { ShowErrorToast, ShowSuccessToast } from '@/components/Library/Toast/Toast';

export const Main = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
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
