export const DisplaySettings = () => {
  return (
    <div className="max-w-175">
      <h1 className="text-xl font-bold mb-10">디스플레이</h1>

      <div className="space-y-6">
        {/* 다크모드 */}
        <div
          className="
            border border-gray-200
            rounded-2xl
            p-6
            flex items-center justify-between
          "
        >
          <div>
            <h3 className="font-semibold text-lg">다크 모드</h3>

            <p className="text-gray-500 mt-1">어두운 테마를 사용합니다.</p>
          </div>

          <button
            className="
              w-14 h-8
              rounded-full
              bg-gray-300
              relative
            "
          >
            <div
              className="
                w-6 h-6
                bg-white
                rounded-full
                absolute
                top-1 left-1
              "
            />
          </button>
        </div>
      </div>
    </div>
  );
};
