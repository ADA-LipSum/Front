import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="w-full h-20 bg-[#F5F5F5] flex items-center pl-18.25 border-b border-[#9C9C9C]">
      {/* 로고 */}
      <Link to="/home">
        <img src="src/assets/LipSum-logo-white.svg" className="w-40" alt="logo" />
      </Link>

      {/* 메뉴 영역 */}
      <div className="flex items-center ml-20 gap-10 text-black font-semibold">
        <Link to="/community">커뮤니티</Link>
        <Link to="/exchange">거래소</Link>
        <Link to="/event">이벤트</Link>
        <Link to="/contact">문의</Link>
      </div>

      {/* 로그인 버튼 */}
      <button className="ml-auto mr-5.75 px-4 py-2 bg-gray-300 text-black font-semibold rounded hover:bg-gray-300 transition hover:cursor-pointer">
        로그인
      </button>
    </div>
  );
};

export default Header;
