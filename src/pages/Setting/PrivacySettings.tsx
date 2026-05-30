export const PrivacySettings = () => {
  return (
    <div className="max-w-187.5">
      <h1 className="text-3xl font-bold mb-10">개인정보 관리</h1>

      <div className="space-y-6">
        {/* 공개 범위 */}
        <div
          className="
            bg-white
            border border-gray-200
            rounded-2xl
            p-6
          "
        >
          <h3 className="font-semibold text-lg mb-2">프로필 공개 범위</h3>

          <p className="text-gray-500 mb-5">다른 사용자에게 공개되는 정보를 설정할 수 있습니다.</p>

          <select
            className="
              w-full
              h-14
              rounded-xl
              border border-gray-200
              px-5
            "
          >
            <option>전체 공개</option>
            <option>팔로워만 공개</option>
            <option>비공개</option>
          </select>
        </div>

        {/* 비밀번호 변경 */}
        <div
          className="
            bg-white
            border border-gray-200
            rounded-2xl
            p-6
          "
        >
          <h3 className="font-semibold text-lg mb-5">비밀번호 변경</h3>

          <div className="space-y-4">
            <input
              type="password"
              placeholder="현재 비밀번호"
              className="
                w-full
                h-14
                rounded-xl
                border border-gray-200
                px-5
              "
            />

            <input
              type="password"
              placeholder="새 비밀번호"
              className="
                w-full
                h-14
                rounded-xl
                border border-gray-200
                px-5
              "
            />

            <button
              className="
                h-13
                px-6
                rounded-xl
                bg-black
                text-white
                font-medium
              "
            >
              비밀번호 변경
            </button>
          </div>
        </div>

        {/* 회원 탈퇴 */}
        <div
          className="
            bg-white
            border border-red-200
            rounded-2xl
            p-6
          "
        >
          <h3 className="font-semibold text-lg text-red-500">회원 탈퇴</h3>

          <p className="text-gray-500 mt-2 mb-5">
            계정을 삭제하면 모든 데이터가 영구적으로 제거됩니다.
          </p>

          <button
            className="
              h-13
              px-6
              rounded-xl
              bg-red-500
              text-white
              font-medium
            "
          >
            회원 탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
};
