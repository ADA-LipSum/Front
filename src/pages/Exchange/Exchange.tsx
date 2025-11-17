import { Link } from "react-router-dom";

export default function Exchange() {
  return (
    <>
      <div className="w-[1920px] h-[200px] mx-auto flex items-center px-4 bg-gray-200">
        <h1 className="ml-10 text-4xl font-bold">거래소</h1>
      </div>

      {/* 카드 리스트 */}
      <div className="max-w-[1500px] mx-auto mt-10 grid grid-cols-3 gap-8 px-4">
        {/* 간식 구매 페이지 카드 */}
        <Link
          to="/exchange/snacks"
          className="block p-6 transition bg-white shadow-md rounded-2xl hover:shadow-lg"
        >
          <h2 className="mb-3 text-2xl font-bold">간식 구매</h2>
          <p className="mb-5 text-gray-600">
            초코바, 젤리, 음료 등 다양한 간식을 구매할 수 있어요.
          </p>
          <div className="px-4 py-2 text-white bg-blue-600 rounded-lg w-fit hover:bg-blue-700">
            이동하기
          </div>
        </Link>

        {/* 장비 구매 페이지 카드 */}
        <Link
          to="/exchange/devices"
          className="block p-6 transition bg-white shadow-md rounded-2xl hover:shadow-lg"
        >
          <h2 className="mb-3 text-2xl font-bold">장비 / 키보드 구매</h2>
          <p className="mb-5 text-gray-600">
            키보드, 마우스 등 아이템을 구매해 업그레이드하세요.
          </p>
          <div className="px-4 py-2 text-white bg-green-600 rounded-lg w-fit hover:bg-green-700">
            이동하기
          </div>
        </Link>

        {/* 프로필/배너 꾸미기 페이지 카드 */}
        <Link
          to="/exchange/profile-decor"
          className="block p-6 transition bg-white shadow-md rounded-2xl hover:shadow-lg"
        >
          <h2 className="mb-3 text-2xl font-bold">프로필 / 배너 꾸미기</h2>
          <p className="mb-5 text-gray-600">
            프로필 이미지, 배너 등 내 페이지를 꾸며보세요.
          </p>
          <div className="px-4 py-2 text-white bg-purple-600 rounded-lg w-fit hover:bg-purple-700">
            이동하기
          </div>
        </Link>
      </div>
    </>
  );
}
