import { Bell, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { readNotification, readAllNotifications, type NotificationResponse } from '@/api/notification';

interface NotificationPanelProps {
  notifications: NotificationResponse[];
}

const formatRelativeTime = (dateString: string): string => {
  // 서버에서 Z 없이 UTC 시간을 전송하는 경우, Z를 추가해 UTC로 명시적 지정
  const isoString =
    dateString.includes('Z') || dateString.includes('+') ? dateString : `${dateString}Z`;
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays === 1) return '어제';
  if (diffDays < 7) return `${diffDays}일 전`;

  return date.toLocaleDateString('ko-KR');
};

export const NotificationPanel = ({ notifications }: NotificationPanelProps) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const notiRef = useRef<HTMLDivElement | null>(null);

  const { mutate: markAsRead } = useMutation({
    mutationFn: readNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const { mutate: markAllAsRead } = useMutation({
    mutationFn: readAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const openNoti = () => {
    setIsOpen(true);
  };

  const closeNoti = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
        closeNoti();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  return (
    <div className="relative" ref={notiRef}>
      <button
        type="button"
        onClick={() => (isOpen ? closeNoti() : openNoti())}
        className="w-10 h-10 rounded-lg flex items-center justify-center hover:cursor-pointer border border-gray-300 hover:bg-gray-100"
      >
        <Bell size={20} color="#6b7280" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 알림 패널 */}
      {isOpen && (
        <div className="absolute right-0 top-17 z-50 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          {/* 패널 헤더 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-900">알림</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  markAllAsRead();
                }}
              >
                모두 읽음
              </button>
              <button
                type="button"
                onClick={closeNoti}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <X size={15} color="#9ca3af" />
              </button>
            </div>
          </div>

          {/* 알림 목록 */}
          <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <li className="flex items-center justify-center px-4 py-8 text-gray-400 text-sm">
                알림이 없습니다
              </li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !n.readAt ? 'bg-blue-50/40' : ''
                  }`}
                  onClick={() => !n.readAt && markAsRead(n.id)}
                >
                  <span
                    className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                      !n.readAt ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-700 leading-snug">{n.message}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {formatRelativeTime(n.createdAt)}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>

          {/* 하단 - 더 보기 */}
          <div className="px-4 py-2.5 border-t border-gray-100 text-center">
            <button
              type="button"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => {
                closeNoti();
                // 알림 페이지로 이동
                window.location.href = '/notifications';
              }}
            >
              더 보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
