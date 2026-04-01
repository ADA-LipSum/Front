import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { getGuestbook, postGuestbook, patchGuestbook, deleteGuestbook } from '@/api/profile';
import { ShowErrorToast } from '../Library/Toast/Toast';

interface GuestbookEntry {
  id: number;
  writerUuid: string;
  writerId: string;
  writerName: string;
  writerProfileImage: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const Guestbook = () => {
  const { customId } = useParams<{ customId: string }>();
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);

  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!customId) return;
    getGuestbook(customId).then(setEntries);
  }, [customId]);

  const handleSubmit = async () => {
    if (!customId || !newContent.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const entry = await postGuestbook(customId, newContent.trim());
      setEntries((prev) => [entry, ...prev]);
      setNewContent('');
    } catch (err: any) {
      if (err?.response?.status === 409) {
        ShowErrorToast('이미 방명록을 작성했습니다.');
      } else {
        ShowErrorToast('방명록 등록에 실패했습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (entryId: number) => {
    if (!customId || !editContent.trim()) return;
    const updated = await patchGuestbook(customId, editContent.trim());
    setEntries((prev) => prev.map((e) => (e.id === entryId ? updated : e)));
    setEditingId(null);
  };

  const handleDelete = async (entryId: number) => {
    if (!customId) return;
    await deleteGuestbook(customId);
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
  };

  const startEdit = (entry: GuestbookEntry) => {
    setEditingId(entry.id);
    setEditContent(entry.content);
  };

  return (
    <div className="w-full mt-16 border-t border-gray-200 pt-10 pb-16">
      {/* 작성 폼 */}
      {isLoggedIn && (
        <div className="flex gap-3 mb-8">
          <img
            src={user?.profileImage}
            alt="me"
            className="w-9 h-9 rounded-full border border-gray-200 shrink-0"
          />
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="방명록을 남겨보세요."
              className="flex-1 text-sm border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-gray-400"
            />
            <button
              onClick={handleSubmit}
              disabled={submitting || !newContent.trim()}
              className="text-sm px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-40 transition"
            >
              등록
            </button>
          </div>
          {submitError && <p className="text-xs text-red-500 mt-1">{submitError}</p>}
        </div>
      )}

      {/* 방명록 목록 */}
      {entries.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">아직 방명록이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {entries.map((entry) => {
            const isMine = isLoggedIn && user?.uuid === entry.writerUuid;
            const isEditing = editingId === entry.id;

            return (
              <div key={entry.id} className="flex gap-3">
                <a href={`/profile/${entry.writerId}`}>
                  <img
                    src={entry.writerProfileImage}
                    alt={entry.writerName}
                    className="w-9 h-9 rounded-full border border-gray-200 shrink-0"
                  />
                </a>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold">{entry.writerName}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(entry.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                    {isMine && !isEditing && (
                      <div className="ml-auto flex gap-2">
                        <button
                          onClick={() => startEdit(entry)}
                          className="text-xs text-gray-400 hover:text-gray-700"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-xs text-gray-400 hover:text-red-500"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleEdit(entry.id)}
                        className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 outline-none focus:border-gray-400"
                      />
                      <button
                        onClick={() => handleEdit(entry.id)}
                        className="text-xs px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700">{entry.content}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Guestbook;
