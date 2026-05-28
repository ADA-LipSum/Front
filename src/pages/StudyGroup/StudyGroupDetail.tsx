import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import {
  ArrowLeft,
  Globe,
  Lock,
  Loader2,
  MoreHorizontal,
  Settings,
  Shield,
  Users,
  X,
} from 'lucide-react';

import {
  approveJoinRequest,
  cancelMyJoinRequest,
  delegateStudyGroupLeader,
  getJoinRequests,
  getStudyGroupDetail,
  getStudyGroupMembers,
  kickStudyGroupMember,
  leaveStudyGroup,
  patchStudyGroupStatus,
  rejectJoinRequest,
  requestJoinStudyGroup,
} from '@/api/studyGroup';
import { markdownComponents } from '@/components/Library/React-Markdown-Syntax/MarkdownComponents';
import Avatar from '@/components/global/Avatar';
import { useAuthStore } from '@/store/authStore';
import type {
  StudyGroupDetail as StudyGroupDetailData,
  StudyGroupJoinRequest,
  StudyGroupMember,
} from '@/types/studyGroupApi';
import { ShowErrorToast, ShowSuccessToast } from '@/components/Library/Toast/Toast';

function apiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const msg = err.response?.data?.message ?? err.response?.data?.errorMessage;
    if (typeof msg === 'string' && msg) return msg;
  }
  return fallback;
}

function parseTechTags(techTags: string): string[] {
  return techTags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('ko-KR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

export const StudyGroupDetail = () => {
  const { groupUuid } = useParams<{ groupUuid: string }>();
  const navigate = useNavigate();
  const { user, isLoggedIn, loading: authLoading } = useAuthStore();
  const [detail, setDetail] = useState<StudyGroupDetailData | null>(null);
  const [members, setMembers] = useState<StudyGroupMember[]>([]);
  const [requests, setRequests] = useState<StudyGroupJoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [openMenuUuid, setOpenMenuUuid] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const loadAll = useCallback(async () => {
    if (!groupUuid) return;
    setLoading(true);
    setForbidden(false);
    try {
      const d = await getStudyGroupDetail(groupUuid);
      setDetail(d);
      let m: StudyGroupMember[] = [];
      try {
        m = await getStudyGroupMembers(groupUuid);
      } catch {
        m = [];
      }
      setMembers(m);
      const leaderFromDetail = d.myRole === 'LEADER';
      const leaderFromMembers =
        !!user && m.some((x) => x.userUuid === user.uuid && x.role === 'LEADER');
      const isLeader = leaderFromDetail || leaderFromMembers || (user?.role === 'ADMIN' && d.isMember);
      if (isLeader) {
        try {
          const r = await getJoinRequests(groupUuid);
          setRequests(r);
        } catch {
          setRequests([]);
        }
      } else {
        setRequests([]);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setForbidden(true);
      } else {
        ShowErrorToast('그룹 정보를 불러오지 못했습니다.');
        navigate('/study-group');
      }
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [groupUuid, navigate, user]);

  useEffect(() => {
    if (!groupUuid) return;
    if (authLoading) return;
    void loadAll();
  }, [groupUuid, authLoading, loadAll]);

  useEffect(() => {
    if (!openMenuUuid) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuUuid(null);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [openMenuUuid]);

  const myRole = useMemo(() => {
    if (!user) return null;
    if (detail?.myRole) return detail.myRole;
    return members.find((m) => m.userUuid === user.uuid)?.role ?? null;
  }, [detail?.myRole, members, user]);

  const isMember = useMemo(() => {
    if (detail?.isMember !== undefined) return detail.isMember;
    if (!user) return false;
    return members.some((m) => m.userUuid === user.uuid);
  }, [detail?.isMember, members, user]);

  const hasPendingRequest = detail?.myJoinRequestStatus === 'PENDING';

  const isLeader = myRole === 'LEADER' || (user?.role === 'ADMIN' && isMember);

  const pendingList = useMemo(
    () => requests.filter((r) => r.status === 'PENDING'),
    [requests],
  );

  const refreshAfterMutation = async () => {
    await loadAll();
  };

  const handleJoin = async () => {
    if (!groupUuid) return;
    if (!isLoggedIn) {
      ShowErrorToast('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    setActionLoading(true);
    try {
      await requestJoinStudyGroup(groupUuid);
      ShowSuccessToast('참가 요청이 전송되었습니다.');
      await refreshAfterMutation();
    } catch (err) {
      ShowErrorToast(apiErrorMessage(err, '참가 신청에 실패했습니다.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!groupUuid) return;
    setActionLoading(true);
    try {
      await cancelMyJoinRequest(groupUuid);
      ShowSuccessToast('참가 요청이 취소되었습니다.');
      await refreshAfterMutation();
    } catch (err) {
      ShowErrorToast(apiErrorMessage(err, '요청 취소에 실패했습니다.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!groupUuid || !window.confirm('정말 이 그룹에서 탈퇴하시겠습니까?')) return;
    setActionLoading(true);
    try {
      await leaveStudyGroup(groupUuid);
      ShowSuccessToast('그룹에서 탈퇴했습니다.');
      navigate('/study-group');
    } catch (err) {
      ShowErrorToast(apiErrorMessage(err, '탈퇴할 수 없습니다. 리더 위임이 필요할 수 있습니다.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (next: 'OPEN' | 'CLOSED') => {
    if (!groupUuid) return;
    setActionLoading(true);
    try {
      await patchStudyGroupStatus(groupUuid, next);
      ShowSuccessToast(next === 'OPEN' ? '다시 모집합니다.' : '모집을 마감했습니다.');
      await refreshAfterMutation();
    } catch (err) {
      ShowErrorToast(apiErrorMessage(err, '상태 변경에 실패했습니다.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async (userUuid: string) => {
    if (!groupUuid) return;
    setActionLoading(true);
    try {
      await approveJoinRequest(groupUuid, userUuid);
      ShowSuccessToast('멤버 승인이 완료되었습니다.');
      await refreshAfterMutation();
    } catch (err) {
      ShowErrorToast(apiErrorMessage(err, '승인에 실패했습니다.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (userUuid: string) => {
    if (!groupUuid) return;
    setActionLoading(true);
    try {
      await rejectJoinRequest(groupUuid, userUuid);
      ShowSuccessToast('요청을 거절했습니다.');
      await refreshAfterMutation();
    } catch (err) {
      ShowErrorToast(apiErrorMessage(err, '거절 처리에 실패했습니다.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleKick = async (targetUuid: string) => {
    if (!groupUuid || !window.confirm('해당 멤버를 보낼까요?')) return;
    setActionLoading(true);
    try {
      await kickStudyGroupMember(groupUuid, targetUuid);
      ShowSuccessToast('처리했습니다.');
      setOpenMenuUuid(null);
      await refreshAfterMutation();
    } catch (err) {
      ShowErrorToast(apiErrorMessage(err, '강제 탈퇴에 실패했습니다.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelegate = async (targetUuid: string) => {
    if (!groupUuid || !window.confirm('이 멤버에게 리더를 위임할까요?')) return;
    setActionLoading(true);
    try {
      await delegateStudyGroupLeader(groupUuid, targetUuid);
      ShowSuccessToast('리더가 변경되었습니다.');
      setOpenMenuUuid(null);
      await refreshAfterMutation();
    } catch (err) {
      ShowErrorToast(apiErrorMessage(err, '리더 위임에 실패했습니다.'));
    } finally {
      setActionLoading(false);
    }
  };

  const renderPrimaryCta = () => {
    if (!detail) return null;
    if (detail.status === 'CLOSED') {
      return (
        <button
          type="button"
          disabled
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-500 cursor-not-allowed"
        >
          모집 마감
        </button>
      );
    }
    if (isLeader) {
      return (
        <button
          type="button"
          onClick={() => setManageOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700"
        >
          <Settings className="w-4 h-4" />
          그룹 관리
        </button>
      );
    }
    if (isMember) {
      return (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
          <Shield className="w-4 h-4" />
          참여 중
        </span>
      );
    }
    if (hasPendingRequest) {
      return (
        <button
          type="button"
          disabled={actionLoading}
          onClick={() => void handleCancelRequest()}
          className="px-4 py-2 rounded-xl text-sm font-semibold border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 disabled:opacity-50"
        >
          신청 취소
        </button>
      );
    }
    return (
      <button
        type="button"
        disabled={actionLoading}
        onClick={() => void handleJoin()}
        className="px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50"
      >
        {isLoggedIn ? '참가 신청' : '로그인 후 참가 신청'}
      </button>
    );
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <Lock className="w-14 h-14 text-gray-300 mb-4" />
        <h1 className="text-xl font-bold text-gray-800">비공개 그룹입니다</h1>
        <p className="text-gray-500 text-sm mt-2 text-center">멤버만 이 그룹 상세를 볼 수 있습니다.</p>
        <Link
          to="/study-group"
          className="mt-8 text-violet-600 font-semibold text-sm hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </Link>
      </div>
    );
  }

  if (!detail) return null;

  const tags = parseTechTags(detail.techTags);
  const fill = Math.min(100, Math.round((detail.memberCount / Math.max(detail.capacity, 1)) * 100));

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/study-group"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-violet-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          스터디 그룹 목록
        </Link>

        <header className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    detail.status === 'OPEN'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {detail.status === 'OPEN' ? '모집중' : '모집마감'}
                </span>
                <span className="text-xs text-gray-500 inline-flex items-center gap-1">
                  {detail.visibility === 'PRIVATE' ? (
                    <>
                      <Lock className="w-3.5 h-3.5" /> 비공개
                    </>
                  ) : (
                    <>
                      <Globe className="w-3.5 h-3.5" /> 공개
                    </>
                  )}
                </span>
                {isLeader && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700">
                    방장
                  </span>
                )}
                {hasPendingRequest && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                    승인 대기중
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 break-words">{detail.name}</h1>
              <p className="text-sm text-gray-500 mt-2">
                by <span className="font-medium text-gray-700">{detail.ownerCustomId}</span>
              </p>
            </div>
            <div className="flex flex-col items-stretch sm:items-end gap-3 shrink-0">
              {renderPrimaryCta()}
              {isMember && myRole !== 'LEADER' && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => void handleLeave()}
                  className="text-xs text-gray-500 hover:text-red-600 underline disabled:opacity-50"
                >
                  그룹 탈퇴
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">참여 인원</span>
                <span className="font-semibold text-gray-900">
                  {detail.memberCount} / {detail.capacity}명
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all"
                  style={{ width: `${fill}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {tags.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 font-medium"
              >
                #{t}
              </span>
            ))}
          </div>
        </header>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">그룹 소개</h2>
          <div className="text-sm text-gray-700 leading-relaxed space-y-3 [&_pre]:text-xs [&_pre]:overflow-x-auto">
            <ReactMarkdown components={markdownComponents}>{detail.description || '_설명 없음_'}</ReactMarkdown>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-500" />
            멤버 ({members.length})
          </h2>
          <ul className="divide-y divide-gray-100">
            {members.map((m) => {
              const isSelf = user?.uuid === m.userUuid;
              const showLeaderMenu =
                isLeader && !isSelf && m.role !== 'LEADER' && myRole === 'LEADER';
              const showAdminKick = user?.role === 'ADMIN' && !isSelf && m.role !== 'LEADER';
              const showMenu = showLeaderMenu || showAdminKick;

              return (
                <li key={m.userUuid} className="py-3 flex items-center gap-3">
                  <Avatar name={m.customId} src={m.profileImage ?? ''} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900 truncate">{m.customId}</span>
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          m.role === 'LEADER'
                            ? 'bg-violet-100 text-violet-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {m.role === 'LEADER' ? 'LEADER' : 'MEMBER'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">가입 {formatDate(m.joinedAt)}</p>
                  </div>
                  {showMenu && (
                    <div className="relative shrink-0" ref={openMenuUuid === m.userUuid ? menuRef : null}>
                      <button
                        type="button"
                        aria-label="멤버 관리"
                        onClick={() => setOpenMenuUuid((id) => (id === m.userUuid ? null : m.userUuid))}
                        className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openMenuUuid === m.userUuid && (
                        <div className="absolute right-0 mt-1 w-44 rounded-xl border border-gray-100 bg-white shadow-lg z-20 py-1 text-sm">
                          {showLeaderMenu && (
                            <button
                              type="button"
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-800"
                              onClick={() => void handleDelegate(m.userUuid)}
                            >
                              리더 위임
                            </button>
                          )}
                          <button
                            type="button"
                            className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600"
                            onClick={() => void handleKick(m.userUuid)}
                          >
                            강제 탈퇴
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          {members.length === 0 && (
            <p className="text-sm text-gray-400 py-6 text-center">멤버 정보를 불러올 수 없습니다.</p>
          )}
        </section>
      </div>

      {manageOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">그룹 관리</h2>
              <button
                type="button"
                onClick={() => setManageOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 border-b border-gray-100 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">모집 상태</p>
                  <p className="text-xs text-gray-500 mt-0.5">닫으면 신규 참가 신청을 받지 않습니다.</p>
                </div>
                <button
                  type="button"
                  disabled={actionLoading || !groupUuid}
                  onClick={() =>
                    void handleToggleStatus(detail.status === 'OPEN' ? 'CLOSED' : 'OPEN')
                  }
                  className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
                    detail.status === 'OPEN' ? 'bg-emerald-500' : 'bg-gray-300'
                  } disabled:opacity-50`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      detail.status === 'OPEN' ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3">참가 요청 ({pendingList.length})</h3>
              {pendingList.length === 0 ? (
                <p className="text-sm text-gray-400 py-8 text-center">대기 중인 요청이 없습니다.</p>
              ) : (
                <ul className="space-y-3">
                  {pendingList.map((r) => (
                    <li
                      key={r.userUuid}
                      className="rounded-xl border border-gray-100 p-3 flex flex-col gap-2"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {r.applicantCustomId ?? r.userUuid.slice(0, 8) + '…'}
                        </p>
                        <p className="text-xs text-gray-400">{formatDate(r.requestedAt)}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => void handleApprove(r.userUuid)}
                          className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50"
                        >
                          승인
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => void handleReject(r.userUuid)}
                          className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          거절
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
