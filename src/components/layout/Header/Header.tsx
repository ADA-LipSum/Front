import { Link } from 'react-router-dom';
import York_Construction_72_logo from '../../../assets/York_Construction_72_logo.svg';

const Header = () => {
    return (
        <header className="flex items-center px-5 py-3 bg-white border-b border-gray-300">
            {/* 로고 영역 */}
            <Link to="/">
                <div className="flex items-center gap-3">
                    <img src={York_Construction_72_logo} alt="Logo" className="w-10" />
                    <span className="text-xl font-bold text-black">LipSum</span>
                </div>
            </Link>

            {/* 메뉴 링크 */}
            <nav className="flex gap-14 ml-10 text-black">
                <Link className="hover:text-blue-600 transition-colors" to="/community">
                    커뮤니티
                </Link>
                <Link className="hover:text-blue-600 transition-colors" to="/exchange">
                    거래소
                </Link>
                <Link className="hover:text-blue-600 transition-colors" to="/events">
                    이벤트
                </Link>
                <Link className="hover:text-blue-600 transition-colors" to="/contact">
                    문의
                </Link>
            </nav>

            {/* 오른쪽 알림 + 프로필 */}
            <div className="ml-auto flex items-center gap-3">
                {/* 알림 아이콘 */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-700 hover:text-black cursor-pointer transition-colors"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                    />
                </svg>

                {/* 프로필 이미지 */}
                <button type="button" onClick={() => alert('프로필 클릭!')} className="cursor-pointer">
                    <img
                        src="https://avatars.githubusercontent.com/u/108007761?v=4"
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </button>
            </div>
        </header>
    );
};

export default Header;
