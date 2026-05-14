export default function ProfileDropdown() {
  return (
    <div className="justify-center items-center mt-2 w-48 bg-white rounded-md shadow-md border-2 border-gray-100 py-1 z-20">
      <p className="block px-4 py-2 text-md text-black">내 프로필</p>
      <hr className="border-gray-200" />
      {/* 프로필 */}
      <section className="">
        <a href="/profile/edit" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          프로필
        </a>
      </section>
      {/* 설정 */}
      <section className="">
        <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">설정</a>
      </section>
      {/* 로그아웃 */}
      <section className="">
        <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          로그아웃
        </a>
      </section>
    </div>
  );
}
