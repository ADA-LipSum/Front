import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Lock, Plus, Search, Users } from 'lucide-react';
import axios from 'axios';

import { createStudyGroup, getStudyGroups } from '@/api/studyGroup';
import { useAuthStore } from '@/store/authStore';
import type {
  CreateStudyGroupBody,
  StudyGroupSummary,
  StudyGroupRecruitStatus,
  StudyGroupVisibility,
} from '@/types/studyGroupApi';
import { ShowErrorToast, ShowSuccessToast } from '@/components/Library/Toast/Toast';

const PAGE_SIZE = 10;

const getPageWindow = (current: number, total: number): (number | 'ellipsis')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const pages: (number | 'ellipsis')[] = [0];
  if (current > 2) pages.push('ellipsis');
  for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) pages.push(i);
  if (current < total - 3) pages.push('ellipsis');
  pages.push(total - 1);
  return pages;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;
  const navClass =
    'px-3 h-8 rounded-lg text-sm font-medium text-gray-500 hover:bg-white hover:border hover:border-gray-200 disabled:opacity-30 transition-all';
  const pages = getPageWindow(currentPage, totalPages);
  return (
    <div className="flex justify-center items-center mt-8 gap-1">
      <button
        type="button"
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className={navClass}
      >
        이전
      </button>
      {pages.map((page, idx) =>
        page === 'ellipsis' ? (
          <span
            key={`e${idx}`}
            className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm select-none"
          >
            ···
          </span>
        ) : (
          <button
            type="button"
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 text-sm rounded-lg font-medium transition-all ${
              currentPage === page
                ? 'bg-violet-500 text-white shadow-sm shadow-violet-200'
                : 'text-gray-500 hover:bg-white hover:border hover:border-gray-200'
            }`}
          >
            {page + 1}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className={navClass}
      >
        다음
      </button>
    </div>
  );
};

function parseTechTags(techTags: string): string[] {
  return techTags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

function apiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const msg = err.response?.data?.message ?? err.response?.data?.errorMessage;
    if (typeof msg === 'string' && msg) return msg;
  }
  return fallback;
}

const emptyForm: CreateStudyGroupBody = {
  name: '',
  description: '',
  techTags: '',
  visibility: 'PUBLIC',
  capacity: 10,
};

export const StudyGroup = () => {
  const navigate = useNavigate();
  const { isLoggedIn, loading: authLoading } = useAuthStore();
  const [items, setItems] = useState<StudyGroupSummary[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [keywordDraft, setKeywordDraft] = useState('');
  const [techDraft, setTechDraft] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [appliedTechTags, setAppliedTechTags] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | StudyGroupRecruitStatus>('ALL');
  const [visibilityFilter, setVisibilityFilter] = useState<'ALL' | StudyGroupVisibility>('ALL');
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<CreateStudyGroupBody>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStudyGroups({
        page,
        size: PAGE_SIZE,
        keyword: appliedKeyword.trim() || undefined,
        techTags: appliedTechTags.trim() || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        visibility: visibilityFilter === 'ALL' ? undefined : visibilityFilter,
      });
      setItems(res.content);
      setTotalPages(Math.max(1, res.totalPages));
    } catch {
      setItems([]);
      setTotalPages(1);
      ShowErrorToast('스터디 그룹 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [page, appliedKeyword, appliedTechTags, statusFilter, visibilityFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    if (!isLoggedIn) {
      ShowErrorToast('로그인 후 그룹을 만들 수 있습니다.');
      navigate('/login');
      return;
    }
    setForm(emptyForm);
    setCreateOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      ShowErrorToast('그룹 이름을 입력해 주세요.');
      return;
    }
    if (form.capacity < 2 || form.capacity > 200) {
      ShowErrorToast('최대 인원은 2~200 사이로 설정해 주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const { groupUuid } = await createStudyGroup({
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
        techTags: form.techTags.trim(),
      });
      ShowSuccessToast('스터디 그룹이 생성되었습니다.');
      setCreateOpen(false);
      navigate(`/study-group/${groupUuid}`);
    } catch (err) {
      ShowErrorToast(apiErrorMessage(err, '그룹 생성에 실패했습니다.'));
    } finally {
      setSubmitting(false);
    }
  };

  const applySearch = () => {
    setAppliedKeyword(keywordDraft.trim());
    setAppliedTechTags(techDraft.trim());
    setPage(0);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">스터디 그룹</h1>
            <p className="text-sm text-gray-500 mt-1">관심사가 비슷한 멤버를 모아 함께 학습해 보세요.</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-violet-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            그룹 만들기
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-end">
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-gray-500 mb-1">검색 (이름·설명)</label>
              <div className="flex gap-2">
                <input
                  value={keywordDraft}
                  onChange={(e) => setKeywordDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                  placeholder="키워드 입력"
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
                />
                <button
                  type="button"
                  onClick={applySearch}
                  className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Search className="w-4 h-4" />
                  검색
                </button>
              </div>
            </div>
            <div className="w-full lg:w-44">
              <label className="block text-xs font-medium text-gray-500 mb-1">기술 태그</label>
              <input
                value={techDraft}
                onChange={(e) => setTechDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                placeholder="react, ts"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
              />
            </div>
            <div className="w-full sm:w-36">
              <label className="block text-xs font-medium text-gray-500 mb-1">모집 상태</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as typeof statusFilter);
                  setPage(0);
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
              >
                <option value="ALL">전체</option>
                <option value="OPEN">모집 중</option>
                <option value="CLOSED">모집 마감</option>
              </select>
            </div>
            <div className="w-full sm:w-36">
              <label className="block text-xs font-medium text-gray-500 mb-1">공개 여부</label>
              <select
                value={visibilityFilter}
                onChange={(e) => {
                  setVisibilityFilter(e.target.value as typeof visibilityFilter);
                  setPage(0);
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
              >
                <option value="ALL">전체</option>
                <option value="PUBLIC">공개</option>
                <option value="PRIVATE">비공개</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-2xl bg-white border border-gray-100 shadow-sm animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">아직 모집 중인 스터디가 없습니다.</p>
            <p className="text-sm text-gray-400 mt-1">첫 번째 스터디 그룹을 만들어보세요!</p>
            {!authLoading && isLoggedIn && (
              <button
                type="button"
                onClick={openCreate}
                className="mt-6 text-sm font-semibold text-violet-600 hover:text-violet-700"
              >
                그룹 만들기 →
              </button>
            )}
          </div>
        ) : (
          <ul className="grid gap-4">
            {items.map((g) => {
              const tags = parseTechTags(g.techTags);
              const fill = Math.min(100, Math.round((g.memberCount / Math.max(g.capacity, 1)) * 100));
              return (
                <li key={g.groupUuid}>
                  <Link
                    to={`/study-group/${g.groupUuid}`}
                    className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-violet-200 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              g.status === 'OPEN'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {g.status === 'OPEN' ? '모집중' : '모집마감'}
                          </span>
                          <span className="text-xs text-gray-500 inline-flex items-center gap-1">
                            {g.visibility === 'PRIVATE' ? (
                              <>
                                <Lock className="w-3.5 h-3.5" /> 비공개
                              </>
                            ) : (
                              <>
                                <Globe className="w-3.5 h-3.5" /> 공개
                              </>
                            )}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 truncate">{g.name}</h2>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{g.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {tags.slice(0, 6).map((t) => (
                            <span
                              key={t}
                              className="text-xs px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 font-medium"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="w-full sm:w-48 shrink-0 space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            인원
                          </span>
                          <span className="font-semibold text-gray-800">
                            {g.memberCount} / {g.capacity}명
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-violet-500 transition-all"
                            style={{ width: `${fill}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 text-right">by {g.ownerCustomId}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">스터디 그룹 만들기</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">그룹 이름</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  placeholder="예: 스프링 스터디"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-y min-h-[100px]"
                  placeholder="스터디 목적, 일정, 진행 방식 등"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  기술 태그 (쉼표로 구분)
                </label>
                <input
                  value={form.techTags}
                  onChange={(e) => setForm((f) => ({ ...f, techTags: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  placeholder="spring, java, jpa"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">공개 여부</label>
                  <select
                    value={form.visibility}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, visibility: e.target.value as StudyGroupVisibility }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
                  >
                    <option value="PUBLIC">공개</option>
                    <option value="PRIVATE">비공개</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">최대 인원</label>
                  <input
                    type="number"
                    min={2}
                    max={200}
                    value={form.capacity}
                    onChange={(e) => setForm((f) => ({ ...f, capacity: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 disabled:opacity-50"
                >
                  {submitting ? '생성 중…' : '생성하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
