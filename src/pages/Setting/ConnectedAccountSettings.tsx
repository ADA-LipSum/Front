const accounts = [
  {
    name: 'Github',
    email: 'github.com/rlaxogh76',
    connected: false,
  },
];

export const ConnectedAccountSettings = () => {
  return (
    <div>
      <h1 className="text-xl font-bold mb-10">연결된 계정</h1>

      <div className="space-y-5">
        {accounts.map((account) => {
          return (
            <div
              key={account.name}
              className="
                border border-gray-200
                rounded-2xl
                p-6
                flex items-center justify-between
              "
            >
              <div className="flex items-center gap-5">
                <div
                  className="
                    w-14 h-14
                    rounded-xl
                    flex items-center justify-center
                  "
                >
                  {/* TODO: 추후에 다크모드 구현 시 아이콘이 화면 색에 따라 변경되도록 구현할 것!! */}
                  <img src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/github.png" />
                </div>

                <div>
                  <p className="font-semibold text-lg">{account.name}</p>

                  <p className="text-gray-500">{account.email}</p>
                </div>
              </div>

              {account.connected ? (
                <button
                  className="
                    px-5 py-3
                    rounded-xl
                    bg-red-50
                    text-red-500
                    font-medium
                  "
                >
                  연결 해제
                </button>
              ) : (
                <button
                  className="
                    px-5 py-3
                    rounded-xl
                    bg-black
                    text-white
                    font-medium
                  "
                >
                  연결하기
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
