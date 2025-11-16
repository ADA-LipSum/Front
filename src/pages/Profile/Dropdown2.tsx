// import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

// 헤더에서 프로필 이미지 클릭 시 나타나는 드롭다운 메뉴 컴포넌트
const ProfileDropdown = () => {
    // const navigate = useNavigate();
    const { user } = useAuth();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <div className="absolute right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg top-12 w-80 h-80">
            <div className="relative">
                <div className="w-full h-32 overflow-hidden rounded-t-lg">
                    <img src="" alt="banner" className="block object-cover w-full h-full bg-gray-950" />
                </div>
                <Link
                    to="/profile"
                    onClick={(e) => {
                        // hide the nearest ancestor dropdown container (matches the root div's "z-50" class)
                        const dropdown = (e.currentTarget as HTMLElement).closest('.z-50') as HTMLElement | null;
                        if (dropdown) dropdown.style.display = 'none';
                    }}
                >
                    <img
                        src={user?.profileImage}
                        alt="avatar"
                        className="absolute object-cover w-20 h-20 transform -translate-x-1/2 -translate-y-1/2 border-4 border-white rounded-full left-1/2 top-32 bg-white"
                    />
                </Link>
            </div>
            <div className="absolute flex justify-end gap-3 bottom-4 left-4 right-4">
                <button
                    className="text-right text-red-600 transition-colors rounded hover:bg-gray-100"
                    onClick={handleLogout}
                >
                    로그아웃
                </button>
            </div>
        </div>
    );
};

export default ProfileDropdown;
