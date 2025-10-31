import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import York_Construction_72_logo from '../../../assets/York_Construction_72_logo.svg';
import ProfileDropdown from './ProfileDropDown';

const Header = () => {
    const [openDropdown, setOpenDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setOpenDropdown((prev) => !prev);

    // 드롭다운 바깥 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpenDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="relative flex items-center px-5 py-3 bg-white border-b border-gray-300">
            {/* 로고 */}
            <Link to="/">
                <div className="flex items-center gap-3">
                    <img src={York_Construction_72_logo} alt="Logo" className="w-10" />
                    <span className="text-xl font-bold text-black">LipSum</span>
                </div>
            </Link>

            {/* 메뉴 */}
            <nav className="flex gap-14 ml-10 text-black">
                <Link className="hover:text-blue-600" to="/community">
                    커뮤니티
                </Link>
                <Link className="hover:text-blue-600" to="/exchange">
                    거래소
                </Link>
                <Link className="hover:text-blue-600" to="/events">
                    이벤트
                </Link>
                <Link className="hover:text-blue-600" to="/contact">
                    문의
                </Link>
            </nav>

            {/* 알림 + 프로필 */}
            <div className="ml-auto flex items-center gap-3 relative" ref={dropdownRef}>
                {/* 알림 */}
                <svg
                    className="w-6 h-6 text-gray-700 cursor-pointer hover:text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                    />
                </svg>

                {/* 프로필 클릭 시 드롭다운 */}
                <button onClick={toggleDropdown}>
                    <img
                        src="https://avatars.githubusercontent.com/u/108007761?v=4"
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    />
                </button>

                {openDropdown && <ProfileDropdown />}
            </div>
        </header>
    );
};

export default Header;
