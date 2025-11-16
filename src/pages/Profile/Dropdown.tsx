import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

// 헤더에서 프로필 이미지 클릭 시 나타나는 드롭다운 메뉴 컴포넌트
const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="absolute right-0 z-50 py-2 bg-white border border-gray-200 rounded-lg shadow-lg top-12 w-80">
      <button
        className="block w-full px-4 py-2 text-left transition-colors hover:bg-gray-100"
        onClick={() => navigate("/profile")}
      >
        프로필 보기
      </button>

      <button
        className="block w-full px-4 py-2 text-left transition-colors hover:bg-gray-100"
        onClick={() => navigate("/settings")}
      >
        설정
      </button>

      <hr className="my-2" />

      <button
        className="block w-full px-4 py-2 text-left text-red-600 transition-colors hover:bg-gray-100"
        onClick={() => handleLogout()}
      >
        로그아웃
      </button>
    </div>
  );
};

export default ProfileDropdown;
