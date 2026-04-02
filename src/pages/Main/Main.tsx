export const Main = () => {
  return (
    <main>
      {/* 메인페이지 상단 배너 */}
      <div className="main-container w-full h-auto px-64 py-14">
        <section>
          <article className="banner-container w-full h-44 bg-gray-200 flex items-center justify-center rounded-2xl">
            <figure>{/* 메인페이지 상단 배너 */}</figure>
          </article>
        </section>

        {/* 공지사항 */}
        <section className="notice-container">
          <article className="content">{/* 공지사항 리스트 */}</article>
        </section>

        {/* 잦은 업데이트 항목 */}
        <section>
          {/* 식단 정보 */}
          <section className="meal-info-container">
            <article className="content">{/* 식단표 */}</article>
          </section>

          {/* 최신 글 */}
          <section className="recent-container">
            <article className="content">{/* 최신 글 리스트 */}</article>
          </section>
        </section>
      </div>

      {/* 산학협력 기업 */}
      <section className="recent-container">
        <article className="content">
          {/* 산학협력 기업 리스트 */}
          {/* https://swiperjs.com/ */}
          {/* 이런거로 무한대로 반복되며 움직이도록 설계 */}
        </article>
      </section>
    </main>
  );

  // const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  // const dispatch = useDispatch<AppDispatch>();
  // const handleLogout = async () => {
  //   try {
  //     await dispatch(logoutAsync()).unwrap();
  //     alert('로그아웃 성공!');
  //     // eslint-disable-next-line unused-imports/no-unused-vars
  //   } catch (err) {
  //     alert('로그아웃 실패');
  //   }
  // };
  // return (
  //   <div>
  //     {isLoggedIn ? (
  //       <div>
  //         <p>로그인 상태입니다.</p>
  //         <button
  //           onClick={handleLogout}
  //           className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
  //         >
  //           로그아웃
  //         </button>
  //       </div>
  //     ) : (
  //       <div>로그인 상태가 아닙니다.</div>
  //     )}
  //   </div>
  // );
};
