import { Link } from "react-router";

export default function Contact() {
  return (
    <div style={{ padding: 20 }}>
      <h1>문의 페이지입니다</h1>
      <Link to="/contact/form">
        <button className="px-4 py-2 text-white bg-blue-600 rounded cursor-pointer hover:bg-blue-700">
          문의하기
        </button>
      </Link>
    </div>
  );
}
