export interface AnnouncementOverViewItem {
  id: number;
  title: string;
  authorName: string;
  authorProfileImage: string;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `약 ${diff}초 전`;
  if (diff < 3600) return `약 ${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `약 ${Math.floor(diff / 3600)}시간 전`;
  if (diff < 86400 * 365) return `약 ${Math.floor(diff / 86400)}일 전`;
  return `${Math.floor(diff / (86400 * 365))}년 전`;
}

export const AnnouncementOverView = () => {
  const mockData: AnnouncementOverViewItem[] = [
    {
      id: 1,
      title: '서비스 점검 안내',
      authorName: '관리자',
      authorProfileImage:
        'https://2026project-s3-ada.s3.ap-northeast-2.amazonaws.com/profiles/1b6f8f54-a6e5-4cc3-bd30-afec528c29ed/19cbdc9e-7924-4fa3-9043-6e6cddb80168.jpg',
      createdAt: '2024-06-30',
    },
    {
      id: 2,
      title: '새로운 기능 출시',
      authorName: '관리자',
      authorProfileImage:
        'https://2026project-s3-ada.s3.ap-northeast-2.amazonaws.com/profiles/1b6f8f54-a6e5-4cc3-bd30-afec528c29ed/19cbdc9e-7924-4fa3-9043-6e6cddb80168.jpg',
      createdAt: '2024-06-28',
    },
    {
      id: 3,
      title: '이용약관 변경 안내',
      authorName: '관리자',
      authorProfileImage:
        'https://2026project-s3-ada.s3.ap-northeast-2.amazonaws.com/profiles/1b6f8f54-a6e5-4cc3-bd30-afec528c29ed/19cbdc9e-7924-4fa3-9043-6e6cddb80168.jpg',
      createdAt: '2024-06-25',
    },
  ];

  return (
    <div className="space-y-4">
      {mockData.map((announcement) => (
        <div
          key={announcement.id}
          className="flex items-center gap-4 rounded-md bg-white p-4 shadow"
        >
          <img
            src={announcement.authorProfileImage}
            alt={`${announcement.authorName} 프로필 이미지`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{announcement.title}</h2>
            <p className="text-sm text-gray-500">
              {announcement.authorName} · {timeAgo(announcement.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
