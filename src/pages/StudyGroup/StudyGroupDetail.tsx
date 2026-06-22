import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Search, Settings, Users } from 'lucide-react';
import axios from 'axios';

import {
  approveJoinRequest,
  cancelMyJoinRequest,
  createStudyGroup,
  getJoinRequests,
  getStudyGroupDetail,
  getStudyGroups,
  patchStudyGroupStatus,
  rejectJoinRequest,
  requestJoinStudyGroup,
} from '@/api/studyGroup';
import { useAuthStore } from '@/store/authStore';
import type {
  CreateStudyGroupBody,
  StudyGroupDetail as StudyGroupDetailData,
  StudyGroupJoinRequest,
  StudyGroupSummary,
} from '@/types/studyGroupApi';
import { ShowErrorToast, ShowSuccessToast } from '@/components/Library/Toast/Toast';
import {
  StudyGroupCreateModal,
  type ExtendedCreateForm,
  EMPTY_FORM,
} from '@/components/Page/study-group/StudyGroupCreateModal';

type CategoryFilter = 'ALL' | '언어 공부' | '프로젝트';

interface GroupMeta {
  duration?: string;
  format?: string;
}

const PAGE_SIZE = 6;

const LANG_MAP: Array<[RegExp, string, string]> = [
  [/영어|english|opic|toeic/i, 'US', 'bg-violet-400'],
  [/일본어|japanese|jlpt/i, 'JP', 'bg-pink-400'],
  [/중국어|chinese|hsk/i, 'CN', 'bg-orange-400'],
  [/스페인어|spanish/i, 'ES', 'bg-yellow-500'],
  [/프랑스어|french/i, 'FR', 'bg-blue-400'],
  [/독일어|german/i, 'DE', 'bg-teal-400'],
];

const PROJ_MAP: Array<[RegExp, string, string]> = [
  [/ai|ml|딥러닝|머신러닝|데이터/i, '🤖', 'bg-sky-400'],
  [/게임|unity|unreal/i, '🎮', 'bg-purple-400'],
  [/앱|mobile|ios|android|react.?native/i, '📱', 'bg-rose-400'],
  [/해커톤|hackathon/i, '🏆', 'bg-amber-400'],
];

const PROJ_COLORS = [
  'bg-rose-400',
  'bg-pink-400',
  'bg-indigo-400',
  'bg-violet-400',
  'bg-cyan-400',
  'bg-amber-500',
];

const TAG_COLORS: Record<string, string> = {
  프론트엔드: 'bg-blue-100 text-blue-700',
  백엔드: 'bg-violet-100 text-violet-700',
  디자인: 'bg-pink-100 text-pink-700',
  데이터: 'bg-emerald-100 text-emerald-700',
  기획: 'bg-amber-100 text-amber-700',
  react: 'bg-cyan-100 text-cyan-700',
  spring: 'bg-green-100 text-green-700',
  java: 'bg-orange-100 text-orange-700',
  typescript: 'bg-blue-100 text-blue-700',
};

const FALLBACK_COLORS = [
  'bg-rose-100 text-rose-700',
  'bg-fuchsia-100 text-fuchsia-700',
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
  'bg-sky-100 text-sky-700',
];

const DURATIONS = [
  '2026.06 ~ 07 (4주)',
  '2026.06 ~ 08 (8주)',
  '2026.06 ~ 09 (12주)',
  '2026.07 ~ 08 (4주)',
  '2026.07 ~ 09 (8주)',
];

const FORMATS = [
  '온라인 · 주 2회',
  '오프라인 · 주 1회',
  '온라인 · 주 3회',
  '오프라인 · 주 2회',
  '온/오프 혼합',
];

function encodeDescription(duration: string, format: string, desc: string): string {
  if (!duration && !format) return desc;
  return `{"d":"${duration}","f":"${format}"}\n---\n${desc}`;
}

function decodeDescription(raw: string): { meta: GroupMeta; text: string } {
  const m = raw.match(/^(\{[^}]+\})\n---\n([\s\S]*)$/);
  if (!m) return { meta: {}, text: raw };
  try {
    const p = JSON.parse(m[1]) as { d?: string; f?: string };
    return { meta: { duration: p.d, format: p.f }, text: m[2] };
  } catch {
    return { meta: {}, text: raw };
  }
}

function parseTechTags(tags: string): string[] {
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

function getBannerConfig(group: StudyGroupSummary): {
  bg: string;
  label: string;
  isEmoji: boolean;
} {
  const key = (group.name + ' ' + group.techTags).toLowerCase();
  for (const [re, label, bg] of LANG_MAP) {
    if (re.test(key)) return { bg, label, isEmoji: false };
  }
  const isLang = /언어|어학|영어|일본어|중국어|english|japanese|chinese|opic|toeic|jlpt|hsk/i.test(
    key,
  );
  if (isLang) return { bg: 'bg-teal-400', label: 'LAN', isEmoji: false };
  for (const [re, label, bg] of PROJ_MAP) {
    if (re.test(key)) return { bg, label, isEmoji: true };
  }
  const hash = group.groupUuid.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return { bg: PROJ_COLORS[hash % PROJ_COLORS.length], label: '', isEmoji: true };
}

function getGroupCategory(group: StudyGroupSummary): '언어 공부' | '프로젝트' {
  const key = (group.name + ' ' + group.techTags).toLowerCase();
  return /언어|어학|영어|일본어|중국어|english|japanese|chinese|opic|toeic|jlpt|hsk/i.test(key)
    ? '언어 공부'
    : '프로젝트';
}

function getTagColor(tag: string): string {
  const lower = tag.toLowerCase();
  for (const [key, cls] of Object.entries(TAG_COLORS)) {
    if (lower.includes(key.toLowerCase())) return cls;
  }
  const h = tag.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return FALLBACK_COLORS[h % FALLBACK_COLORS.length];
}

function strHash(s: string): number {
  return s.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
}

function formatDate(iso?: string, fallbackUuid?: string): string {
  if (iso) {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }
  if (fallbackUuid) {
    const daysAgo = strHash(fallbackUuid) % 14;
    const d = new Date('2026-06-15');
    d.setDate(d.getDate() - daysAgo);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }
  return '';
}

function getMockDuration(uuid: string): string {
  return DURATIONS[strHash(uuid) % DURATIONS.length];
}

function getMockFormat(uuid: string): string {
  return FORMATS[strHash(uuid) % FORMATS.length];
}

function apiErr(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const m = err.response?.data?.message ?? err.response?.data?.errorMessage;
    if (typeof m === 'string' && m) return m;
  }
  return fallback;
}

function getMockAvatarIndices(seed: string, count: number): number[] {
  const base = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return Array.from({ length: count }, (_, i) => ((base * (i + 3) * 7) % 70) + 1);
}

const AvatarStack = ({
  count,
  capacity,
  members,
}: {
  count: number;
  capacity: number;
  members?: Array<{ userUuid: string; name: string; profileImage?: string }>;
}) => {
  const MAX_VISIBLE = 5;
  const hasReal = members && members.length > 0;

  const avatars: Array<{ src: string; alt: string }> = hasReal
    ? members.slice(0, MAX_VISIBLE).map((m) => ({
        src:
          m.profileImage ??
          `https://i.pravatar.cc/40?img=${getMockAvatarIndices(m.userUuid, 1)[0]}`,
        alt: m.name,
      }))
    : [];

  const realOverflow = hasReal && members.length > MAX_VISIBLE ? members.length - MAX_VISIBLE : 0;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {avatars.map((a, i) => (
          <img
            key={i}
            src={a.src}
            alt={a.alt}
            className={`w-6 h-6 rounded-full border-2 border-white object-cover shrink-0 ${i > 0 ? '-ml-2' : ''}`}
          />
        ))}
        {realOverflow > 0 && (
          <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500 -ml-2 shrink-0">
            +{realOverflow}
          </div>
        )}
      </div>
      <span className="text-[11px] text-gray-500 shrink-0">
        {count}/{capacity}명
      </span>
    </div>
  );
};

const Pagination = ({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) => {
  if (total <= 1) return null;
  const pages: (number | 'e')[] = [];
  if (total <= 7) {
    for (let i = 0; i < total; i++) pages.push(i);
  } else {
    pages.push(0);
    if (current > 2) pages.push('e');
    for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++)
      pages.push(i);
    if (current < total - 3) pages.push('e');
    pages.push(total - 1);
  }
  return (
    <div className="flex justify-center items-center mt-6 gap-1">
      <button
        type="button"
        disabled={current === 0}
        onClick={() => onChange(current - 1)}
        className="p-1.5 rounded-sm text-gray-500 hover:bg-white hover:border hover:border-gray-200 disabled:opacity-30"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pages.map((p, idx) =>
        p === 'e' ? (
          <span
            key={`e${idx}`}
            className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm"
          >
            ···
          </span>
        ) : (
          <button
            type="button"
            key={p}
            onClick={() => onChange(p)}
            className={`w-8 h-8 text-sm rounded-sm font-medium transition-all ${
              current === p
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-500 hover:bg-white hover:border hover:border-gray-200'
            }`}
          >
            {p + 1}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={current === total - 1}
        onClick={() => onChange(current + 1)}
        className="p-1.5 rounded-sm text-gray-500 hover:bg-white hover:border hover:border-gray-200 disabled:opacity-30"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

export const StudyGroupDetail = () => {
  const navigate = useNavigate();
  const { isLoggedIn, loading: authLoading, user } = useAuthStore();

  const [allItems, setAllItems] = useState<StudyGroupSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [keywordDraft, setKeywordDraft] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ALL');
  const [recruitingOnly, setRecruitingOnly] = useState(false);
  const [page, setPage] = useState(0);

  const [selectedGroup, setSelectedGroup] = useState<StudyGroupSummary | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<StudyGroupDetailData | null>(null);
  const [selectedRequests, setSelectedRequests] = useState<StudyGroupJoinRequest[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [detailRefreshKey, setDetailRefreshKey] = useState(0);

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<ExtendedCreateForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // ── Data loading ──

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStudyGroups({
        page: 0,
        size: 100,
        keyword: appliedKeyword || undefined,
      });
      setAllItems(res.content);
      if (res.content.length > 0) {
        setSelectedGroup(res.content[0]);
      }
    } catch {
      setAllItems([]);
      ShowErrorToast('스터디 그룹 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [appliedKeyword]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  // Load detail when selected group changes
  const selectedGroupUuid = selectedGroup?.groupUuid;
  const userUuid = user?.uuid;
  const userRole = user?.role;

  useEffect(() => {
    if (!selectedGroupUuid || authLoading) return;
    let cancelled = false;
    setDetailLoading(true);
    setSelectedDetail(null);
    setSelectedRequests([]);

    const fetch = async () => {
      try {
        const d = await getStudyGroupDetail(selectedGroupUuid);
        if (cancelled) return;
        setSelectedDetail(d);
        const isLeader = d.myRole === 'LEADER' || (userRole === 'ADMIN' && d.isMember);
        if (isLeader) {
          try {
            const r = await getJoinRequests(selectedGroupUuid);
            if (!cancelled) setSelectedRequests(r.filter((x) => x.status === 'PENDING'));
          } catch {
            /* ignore */
          }
        }
      } catch {
        if (!cancelled) setSelectedDetail(null);
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    };
    void fetch();
    return () => {
      cancelled = true;
    };
  }, [selectedGroupUuid, authLoading, userUuid, userRole, detailRefreshKey]);

  // ── Filtered + paged items ──

  const filteredItems = useMemo(() => {
    let items = allItems;
    if (categoryFilter !== 'ALL') {
      items = items.filter((g) => getGroupCategory(g) === categoryFilter);
    }
    if (recruitingOnly) {
      items = items.filter((g) => g.status === 'OPEN');
    }
    return items;
  }, [allItems, categoryFilter, recruitingOnly]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));

  const pagedItems = useMemo(() => {
    const start = page * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, page]);

  const counts = useMemo(
    () => ({
      all: allItems.length,
      language: allItems.filter((g) => getGroupCategory(g) === '언어 공부').length,
      project: allItems.filter((g) => getGroupCategory(g) === '프로젝트').length,
    }),
    [allItems],
  );

  // ── Handlers ──

  const refreshDetail = () => setDetailRefreshKey((k) => k + 1);

  const openCreate = () => {
    if (!isLoggedIn) {
      ShowErrorToast('로그인 후 공고를 등록할 수 있습니다.');
      navigate('/login');
      return;
    }
    setForm(EMPTY_FORM);
    setCreateOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      ShowErrorToast('제목을 입력해 주세요.');
      return;
    }
    if (form.capacity < 2 || form.capacity > 200) {
      ShowErrorToast('최대 인원은 2~200 사이로 설정해 주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const body: CreateStudyGroupBody = {
        name: form.name.trim(),
        description: encodeDescription(
          form.duration.trim(),
          form.format.trim(),
          form.description.trim(),
        ),
        techTags: form.techTags.trim(),
        category: form.category,
        visibility: form.visibility,
        capacity: form.capacity,
        inviteLink: form.inviteLink?.trim() || undefined,
      };
      await createStudyGroup(body, form.thumbnail);
      ShowSuccessToast('공고가 등록되었습니다.');
      setCreateOpen(false);
      void loadAll();
    } catch (err) {
      ShowErrorToast(apiErr(err, '공고 등록에 실패했습니다.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async () => {
    if (!selectedGroup) return;
    if (!isLoggedIn) {
      ShowErrorToast('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    setActionLoading(true);
    try {
      await requestJoinStudyGroup(selectedGroup.groupUuid);
      ShowSuccessToast('참가 요청이 전송되었습니다.');
      refreshDetail();
    } catch (err) {
      ShowErrorToast(apiErr(err, '참가 신청에 실패했습니다.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!selectedGroup) return;
    setActionLoading(true);
    try {
      await cancelMyJoinRequest(selectedGroup.groupUuid);
      ShowSuccessToast('참가 요청이 취소되었습니다.');
      refreshDetail();
    } catch (err) {
      ShowErrorToast(apiErr(err, '취소에 실패했습니다.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedGroup || !selectedDetail) return;
    const next = selectedDetail.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    setActionLoading(true);
    try {
      await patchStudyGroupStatus(selectedGroup.groupUuid, next);
      ShowSuccessToast(next === 'OPEN' ? '다시 모집합니다.' : '모집을 마감했습니다.');
      setAllItems((items) =>
        items.map((g) => (g.groupUuid === selectedGroup.groupUuid ? { ...g, status: next } : g)),
      );
      setSelectedGroup((g) => (g ? { ...g, status: next } : g));
      refreshDetail();
    } catch (err) {
      ShowErrorToast(apiErr(err, '상태 변경에 실패했습니다.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async (targetUuid: string) => {
    if (!selectedGroup) return;
    setActionLoading(true);
    try {
      await approveJoinRequest(selectedGroup.groupUuid, targetUuid);
      ShowSuccessToast('승인되었습니다.');
      setSelectedRequests((r) => r.filter((x) => x.userUuid !== targetUuid));
    } catch (err) {
      ShowErrorToast(apiErr(err, '승인에 실패했습니다.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (targetUuid: string) => {
    if (!selectedGroup) return;
    setActionLoading(true);
    try {
      await rejectJoinRequest(selectedGroup.groupUuid, targetUuid);
      ShowSuccessToast('거절되었습니다.');
      setSelectedRequests((r) => r.filter((x) => x.userUuid !== targetUuid));
    } catch (err) {
      ShowErrorToast(apiErr(err, '거절에 실패했습니다.'));
    } finally {
      setActionLoading(false);
    }
  };

  const applySearch = () => {
    setAppliedKeyword(keywordDraft.trim());
    setPage(0);
  };

  // ── Derived display values ──

  const isOwn = (g: StudyGroupSummary) => !!user && g.ownerUuid === user.uuid;
  const selectedIsOwn = selectedGroup ? isOwn(selectedGroup) : false;
  const isLeader =
    selectedDetail?.myRole === 'LEADER' || (userRole === 'ADMIN' && selectedDetail?.isMember);

  const decodedDetail = useMemo(() => {
    if (!selectedGroup) return null;
    const { meta, text } = decodeDescription(selectedGroup.description);
    return {
      duration: meta.duration || getMockDuration(selectedGroup.groupUuid),
      format: meta.format || getMockFormat(selectedGroup.groupUuid),
      text,
    };
  }, [selectedGroup]);

  const selectedTags = selectedGroup ? parseTechTags(selectedGroup.techTags) : [];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">스터디 그룹</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              언어 공부와 프로젝트로 함께 성장할 팀을 찾아보세요
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-sm border border-gray-200 bg-white px-3 py-2 shadow-sm">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                value={keywordDraft}
                onChange={(e) => setKeywordDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                placeholder="스터디 제목으로 검색"
                className="w-44 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
              />
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 rounded-sm bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-sm bg-gray-400 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Filter row ── */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {[
              { id: 'ALL' as const, label: '전체', count: counts.all },
              { id: '언어 공부' as const, label: '언어 공부', count: counts.language, dot: true },
              { id: '프로젝트' as const, label: '프로젝트', count: counts.project, square: true },
            ].map(({ id, label, count, dot, square }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setCategoryFilter(id);
                  setPage(0);
                }}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-semibold transition-all ${
                  categoryFilter === id
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {dot && (
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${categoryFilter === id ? 'bg-white' : 'bg-blue-500'}`}
                  />
                )}
                {square && (
                  <span
                    className={`w-2 h-2 rounded-sm shrink-0 ${categoryFilter === id ? 'bg-white' : 'bg-indigo-500'}`}
                  />
                )}
                {label} {count}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-sm text-gray-600">모집중만 보기</span>
            <button
              type="button"
              role="switch"
              aria-checked={recruitingOnly}
              onClick={() => {
                setRecruitingOnly((v) => !v);
                setPage(0);
              }}
              className={`relative w-10 h-6 rounded-full transition-colors ${
                recruitingOnly ? 'bg-gray-900' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  recruitingOnly ? 'translate-x-4' : ''
                }`}
              />
            </button>
          </label>
        </div>

        {/* ── Main: card grid + detail panel ── */}
        <div className="flex gap-5 items-start">
          {/* Card grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-56 rounded-sm bg-white border border-gray-100 animate-pulse"
                  />
                ))}
              </div>
            ) : pagedItems.length === 0 ? (
              <div className="rounded-sm border border-dashed border-gray-200 bg-white py-20 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">모집 중인 스터디가 없습니다.</p>
                {!authLoading && isLoggedIn && (
                  <button
                    type="button"
                    onClick={openCreate}
                    className="mt-4 text-sm font-semibold text-gray-700 hover:text-gray-900"
                  >
                    공고 등록하기 →
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {pagedItems.map((g) => {
                  const banner = getBannerConfig(g);
                  const tags = parseTechTags(g.techTags);
                  const isClosed = g.status === 'CLOSED';
                  const own = isOwn(g);
                  const cat = getGroupCategory(g);
                  const isSelected = selectedGroup?.groupUuid === g.groupUuid;

                  return (
                    <button
                      key={g.groupUuid}
                      type="button"
                      onClick={() => setSelectedGroup(g)}
                      className={`w-full text-left rounded-sm overflow-hidden transition-all bg-white flex flex-col h-72 ${
                        isSelected ? 'shadow-lg' : 'hover:shadow-md'
                      }`}
                    >
                      {/* Banner */}
                      <div
                        className={`relative h-40 overflow-hidden ${!g.thumbnailImage ? banner.bg : ''} flex items-center justify-center border-b border-b-gray-200`}
                      >
                        {g.thumbnailImage ? (
                          <img
                            src={g.thumbnailImage}
                            alt="배너"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span
                            className={
                              banner.isEmoji
                                ? 'text-4xl'
                                : 'text-3xl font-black text-white/90 tracking-tight'
                            }
                          >
                            {banner.label}
                          </span>
                        )}
                        {isClosed && (
                          <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-red-400/60 text-white">
                            마감됨
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3 flex flex-col flex-1">
                        <div className="flex flex-wrap gap-1 mb-1.5">
                          {cat === '언어 공부' ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                              언어 · {banner.label}
                              {tags[0] ? ` · ${tags[0]}` : ''}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                              <span className="w-1.5 h-1.5 rounded-sm bg-indigo-500 shrink-0" />
                              프로젝트
                            </span>
                          )}
                          {own && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600">
                              내 공고
                            </span>
                          )}
                          {g.visibility === 'PRIVATE' && !isClosed && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700">
                              승인원
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-2">
                          {g.name}
                        </h3>

                        <div className="flex flex-wrap gap-1 mb-2.5">
                          {tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${getTagColor(t)}`}
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                              <img
                                src={g.ownerProfileImage}
                                alt="Owner Profile"
                                className="w-full h-full object-cover rounded-full"
                              />
                            </div>
                            <span className="text-[11px] text-gray-500 truncate max-w-15">
                              {g.ownerCustomId}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              · {formatDate(g.createdAt, g.groupUuid)}
                            </span>
                          </div>
                          <AvatarStack
                            count={g.memberCount}
                            capacity={g.capacity}
                            members={g.members}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <Pagination current={page} total={totalPages} onChange={setPage} />
          </div>

          {/* Detail panel */}
          {selectedGroup && (
            <div className="w-80 xl:w-90 shrink-0 top-20 bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden max-h-[calc(100vh-120px)] overflow-y-auto">
              {/* Banner */}
              {(() => {
                const b = getBannerConfig(selectedGroup);
                return (
                  <div
                    className={`h-44 overflow-hidden ${!selectedDetail?.thumbnailImage && !selectedGroup.thumbnailImage ? b.bg : ''} flex items-center justify-center`}
                  >
                    {(selectedDetail?.thumbnailImage ?? selectedGroup.thumbnailImage) ? (
                      <img
                        src={selectedDetail?.thumbnailImage ?? selectedGroup.thumbnailImage}
                        alt="배너"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className={
                          b.isEmoji
                            ? 'text-5xl'
                            : 'text-4xl font-black text-white/90 tracking-tight'
                        }
                      >
                        {b.label}
                      </span>
                    )}
                  </div>
                );
              })()}

              <div className="p-5">
                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {getGroupCategory(selectedGroup) === '언어 공부' ? (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-blue-50 text-blue-700 border border-blue-100">
                      언어 공부
                    </span>
                  ) : (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 border border-indigo-100">
                      프로젝트
                    </span>
                  )}
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-sm border ${
                      selectedGroup.status === 'OPEN'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}
                  >
                    {selectedGroup.status === 'OPEN' ? '모집중' : '마감됨'}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-sm font-bold text-gray-900 mb-2 leading-snug">
                  {selectedGroup.name}
                </h2>

                {/* Author */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                      <img
                        src={selectedGroup.ownerProfileImage}
                        alt="Owner Profile"
                        className="w-full h-full object-cover rounded-full cursor-pointer"
                        onClick={() => navigate(`/profile/${selectedGroup.ownerCustomId}`)}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedGroup.ownerCustomId}
                    </span>
                  </div>
                  {selectedIsOwn && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-sm bg-rose-50 text-rose-600 border border-rose-100">
                      내가 올린 공고
                    </span>
                  )}
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-gray-50 pt-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">모집 분야</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedTags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${getTagColor(t)}`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">진행 기간</p>
                    <p className="text-xs font-medium text-gray-800">{decodedDetail?.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">진행 방식</p>
                    <p className="text-xs font-medium text-gray-800">{decodedDetail?.format}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">모집 인원</p>
                    <span className="text-xs font-semibold text-gray-800">
                      {selectedGroup.memberCount}/{selectedGroup.capacity}명
                    </span>
                  </div>
                </div>

                {/* Description */}
                {decodedDetail?.text && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-1">소개</p>
                    <p className="text-xs text-gray-700 leading-relaxed line-clamp-4">
                      {decodedDetail.text}
                    </p>
                  </div>
                )}

                {/* CTA for owners: status toggle */}
                {!detailLoading && selectedDetail && selectedIsOwn && (
                  <div className="mb-4">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => void handleToggleStatus()}
                      className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${
                        selectedDetail.status === 'OPEN'
                          ? 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      {actionLoading
                        ? '처리 중…'
                        : selectedDetail.status === 'OPEN'
                          ? '모집 마감하기'
                          : '다시 모집하기'}
                    </button>
                  </div>
                )}

                {/* CTA for non-owners */}
                {!detailLoading && selectedDetail && !selectedIsOwn && (
                  <div className="mb-4">
                    {selectedDetail.status === 'CLOSED' ? (
                      <button
                        type="button"
                        disabled
                        className="w-full py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
                      >
                        모집 마감
                      </button>
                    ) : selectedDetail.isMember ? (
                      <span className="block w-full py-2 text-center rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        참여 중
                      </span>
                    ) : selectedDetail.myJoinRequestStatus === 'PENDING' ? (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => void handleCancelRequest()}
                        className="w-full py-2 rounded-xl text-sm font-semibold border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 disabled:opacity-50"
                      >
                        신청 취소
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => void handleJoin()}
                        className="w-full py-2 rounded-xl text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
                      >
                        {isLoggedIn ? '참가 신청' : '로그인 후 신청'}
                      </button>
                    )}
                  </div>
                )}

                {/* Applicant management (for group leader) */}
                {isLeader && (
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-gray-900">신청자 승인 관리</p>
                      {selectedRequests.length > 0 && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                          {selectedRequests.length}명 대기중
                        </span>
                      )}
                    </div>

                    {selectedRequests.length === 0 ? (
                      <p className="text-xs text-gray-400 py-3 text-center">
                        대기 중인 신청자가 없습니다.
                      </p>
                    ) : (
                      <ul className="space-y-3 mb-3">
                        {selectedRequests.map((r) => (
                          <li key={r.userUuid}>
                            <div className="flex items-start gap-2 mb-2">
                              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                <img
                                  src={r.profileImage}
                                  alt="Profile"
                                  className="w-full h-full object-cover rounded-full text-gray-400 cursor-pointer"
                                  onClick={() => navigate(`/profile/${r.customId}`)}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-gray-900">
                                  {r.customId ?? '신청자'}
                                </p>
                                <p className="text-[11px] text-gray-500 line-clamp-2">
                                  안녕하세요! 함께하고 싶습니다.
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 pl-9">
                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => void handleReject(r.userUuid)}
                                className="flex-1 py-1 text-[11px] font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                              >
                                거부
                              </button>
                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => void handleApprove(r.userUuid)}
                                className="flex-1 py-1 text-[11px] font-semibold rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
                              >
                                승인
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    {selectedDetail && !selectedIsOwn && (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => void handleToggleStatus()}
                        className="w-full py-1.5 text-[11px] font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        {selectedDetail.status === 'OPEN' ? '모집 마감하기' : '다시 모집하기'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <StudyGroupCreateModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        form={form}
        onFormChange={setForm}
        submitting={submitting}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};
