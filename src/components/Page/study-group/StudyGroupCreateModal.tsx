import { useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import type { StudyGroupVisibility, StudyGroupCategory } from '@/types/studyGroupApi';

export interface ExtendedCreateForm {
  name: string;
  description: string;
  techTags: string;
  category: StudyGroupCategory;
  visibility: StudyGroupVisibility;
  capacity: number;
  duration: string;
  format: string;
  inviteLink?: string;
  thumbnail?: File | null;
}

export const EMPTY_FORM: ExtendedCreateForm = {
  name: '',
  description: '',
  techTags: '',
  category: 'LANGUAGE_STUDY',
  visibility: 'PUBLIC',
  capacity: 5,
  duration: '',
  format: '',
};

interface StudyGroupCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ExtendedCreateForm;
  onFormChange: (
    form: ExtendedCreateForm | ((f: ExtendedCreateForm) => ExtendedCreateForm),
  ) => void;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
}

export const StudyGroupCreateModal = ({
  open,
  onOpenChange,
  form,
  onFormChange,
  submitting,
  onSubmit,
}: StudyGroupCreateModalProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">공고 등록</h2>
        <form
          onSubmit={(e) => {
            void onSubmit(e);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input
              required
              value={form.name}
              onChange={(e) => {
                const updater = (f: ExtendedCreateForm) => ({ ...f, name: e.target.value });
                onFormChange(updater);
              }}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="예: React 스터디 팀원 모집"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              썸네일 이미지 등록
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const updater = (f: ExtendedCreateForm) => ({ ...f, thumbnail: file });
                  onFormChange(updater);
                }
              }}
              className="w-full rounded-lg border border-gray-200 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 file:bg-gray-600 file:text-white file:cursor-pointer file:hover:bg-slate-600 file:rounded file:px-2 file:py-1 file:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
            <select
              value={form.category}
              onChange={(e) => {
                const updater = (f: ExtendedCreateForm) => ({
                  ...f,
                  category: e.target.value as StudyGroupCategory,
                });
                onFormChange(updater);
              }}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="LANGUAGE_STUDY" className="text-gray-700">
                언어 공부
              </option>
              <option value="PROJECT_DEVELOPMENT" className="text-gray-700">
                프로젝트 개발
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              모집 분야 (쉼표로 구분)
            </label>
            <input
              value={form.techTags}
              onChange={(e) => {
                const updater = (f: ExtendedCreateForm) => ({ ...f, techTags: e.target.value });
                onFormChange(updater);
              }}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="프론트엔드, 백엔드, 디자인"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">진행 기간</label>
              <input
                value={form.duration}
                onChange={(e) => {
                  const updater = (f: ExtendedCreateForm) => ({ ...f, duration: e.target.value });
                  onFormChange(updater);
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="예: 2026.06 ~ 08 (8주)"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">진행 방식</label>
              <input
                value={form.format}
                onChange={(e) => {
                  const updater = (f: ExtendedCreateForm) => ({ ...f, format: e.target.value });
                  onFormChange(updater);
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="예: 오프라인 · 주 2회"
                required
              />
            </div>
          </div>
          <div>
            <div
              data-tooltip-id="invite-link-tooltip"
              data-tooltip-content="스터디 그룹에 참여할 수 있는 초대 링크를 입력하세요. (선택 사항)"
              className="cursor-default"
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">관련 초대 링크</label>
              <Tooltip id="invite-link-tooltip" place="left-start" className="text-xs z-50" />
            </div>
            <input
              value={form.inviteLink}
              onChange={(e) => {
                const updater = (f: ExtendedCreateForm) => ({ ...f, inviteLink: e.target.value });
                onFormChange(updater);
              }}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="예: https://example.com/invite"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">소개</label>
            <textarea
              value={form.description}
              onChange={(e) => {
                const updater = (f: ExtendedCreateForm) => ({ ...f, description: e.target.value });
                onFormChange(updater);
              }}
              rows={4}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-y min-h-25 focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="스터디 목적, 일정, 진행 방식 등을 적어주세요"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">공개 여부</label>
              <select
                value={form.visibility}
                onChange={(e) => {
                  const updater = (f: ExtendedCreateForm) => ({
                    ...f,
                    visibility: e.target.value as StudyGroupVisibility,
                  });
                  onFormChange(updater);
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <option value="PUBLIC">공개</option>
                <option value="PRIVATE">비공개 (승인 필요)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">모집 인원</label>
              <input
                type="number"
                min={2}
                max={200}
                value={form.capacity}
                onChange={(e) => {
                  const updater = (f: ExtendedCreateForm) => ({
                    ...f,
                    capacity: Number(e.target.value),
                  });
                  onFormChange(updater);
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 disabled:opacity-50"
            >
              {submitting ? '등록 중…' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
