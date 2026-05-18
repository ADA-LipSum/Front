const notifications = [
  {
    title: '공지사항 알림',
    description: '중요한 공지사항을 받을 수 있어요!',
  },
  {
    title: '댓글 알림',
    description: '달린 댓글에 대해 알림을 받을 수 있어요!',
  },
  {
    title: '이벤트 및 프로모션 알림',
    description: '이벤트 및 프로모션 알림을 받을 수 있어요!',
  },
];

export const NotificationSettings = () => {
  return (
    <div className="max-w-187.5">
      <h1 className="text-center text-xl font-bold mb-10">알림 설정</h1>

      <div className="space-y-5">
        {notifications.map((notification) => (
          <div
            key={notification.title}
            className="
              border border-gray-200
              rounded-2xl
              p-6
              flex items-center justify-between
            "
          >
            <div>
              <h3 className="font-semibold text-lg">{notification.title}</h3>

              <p className="text-gray-500 mt-1">{notification.description}</p>
            </div>

            <button
              className="
                w-14 h-8
                rounded-full
                bg-blue-500
                relative
              "
            >
              <div
                className="
                  w-6 h-6
                  bg-white
                  rounded-full
                  absolute
                  top-1 right-1
                "
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
