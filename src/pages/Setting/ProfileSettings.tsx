import Avatar from '@/components/global/Avatar';

export const ProfileSettings = () => {
  return (
    <div className="flex gap-20">
      {/* Left Form */}
      <div className="flex-1 max-w-175">
        <h1 className="text-xl font-bold mb-10 text-gray-800">회원정보</h1>

        <div className="space-y-8">
          {/* 이름 */}
          <div>
            <label className="block mb-3 font-medium">이름</label>

            <input
              type="text"
              className="
                w-full
                h-14
                px-5
                rounded-xl
                border border-gray-200
                outline-none
                focus:border-black
              "
              placeholder="이름 입력"
            />
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block mb-3 font-medium">닉네임</label>

            <input
              type="text"
              className="
                w-full
                h-14
                px-5
                rounded-xl
                border border-gray-200
                outline-none
                focus:border-black
              "
            />
          </div>

          {/* 자기소개 */}
          <div>
            <label className="block mb-3 font-medium">소개</label>

            <textarea
              className="
                w-full
                h-45
                p-5
                rounded-xl
                border border-gray-200
                resize-none
              "
              placeholder="나를 소개해주세요."
            />
          </div>
        </div>
      </div>

      {/* Right Profile */}
      <div className="w-55 flex justify-center">
        <div className="w-45 h-45 rounded-full overflow-hidden bg-gray-200">
          <Avatar
            src={localStorage.getItem('profileImage') || ''}
            className="object-cover"
            size="full"
            name={'프로필 이미지'}
          />
        </div>
      </div>
    </div>
  );
};
