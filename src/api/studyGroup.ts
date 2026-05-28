import type { AxiosResponse } from 'axios';
import axios from './axios';
import type {
  CreateStudyGroupBody,
  CreateStudyGroupResponse,
  StudyGroupDetail,
  StudyGroupJoinRequest,
  StudyGroupListParams,
  StudyGroupListResult,
  StudyGroupMember,
  StudyGroupRecruitStatus,
  StudyGroupSummary,
} from '@/types/studyGroupApi';

interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
  errorCode?: string | null;
}

function unwrap<T>(res: AxiosResponse<ApiResponse<T> | T>): T {
  const body = res.data as ApiResponse<T> | T;
  if (body && typeof body === 'object' && 'data' in body && (body as ApiResponse<T>).data !== undefined) {
    return (body as ApiResponse<T>).data;
  }
  return body as T;
}

function normalizeListPayload(raw: unknown, page: number, size: number): StudyGroupListResult {
  if (Array.isArray(raw)) {
    return {
      content: raw as StudyGroupSummary[],
      totalPages: 1,
      totalElements: raw.length,
      number: page,
      size,
    };
  }
  const obj = raw as Partial<StudyGroupListResult> & { content?: StudyGroupSummary[] };
  return {
    content: obj.content ?? [],
    totalPages: obj.totalPages ?? 1,
    totalElements: obj.totalElements ?? (obj.content?.length ?? 0),
    number: obj.number ?? page,
    size: obj.size ?? size,
  };
}

export const createStudyGroup = async (body: CreateStudyGroupBody) => {
  const res = await axios.post<ApiResponse<CreateStudyGroupResponse>>('/api/studies/groups', body);
  return unwrap(res);
};

export const getStudyGroups = async (params: StudyGroupListParams) => {
  const page = params.page ?? 0;
  const size = params.size ?? 10;
  const res = await axios.get<ApiResponse<unknown>>('/api/studies/groups', {
    params: { ...params, page, size },
  });
  const raw = unwrap(res);
  return normalizeListPayload(raw, page, size);
};

export const getStudyGroupDetail = async (groupUuid: string) => {
  const res = await axios.get<ApiResponse<StudyGroupDetail>>(`/api/studies/groups/${groupUuid}`);
  return unwrap(res);
};

export const requestJoinStudyGroup = async (groupUuid: string) => {
  const res = await axios.post<ApiResponse<unknown>>(`/api/studies/groups/${groupUuid}/join`);
  return unwrap(res);
};

export const cancelMyJoinRequest = async (groupUuid: string) => {
  const res = await axios.delete<ApiResponse<unknown>>(`/api/studies/groups/${groupUuid}/requests/my`);
  return unwrap(res);
};

export const getJoinRequests = async (groupUuid: string) => {
  const res = await axios.get<ApiResponse<StudyGroupJoinRequest[]>>(
    `/api/studies/groups/${groupUuid}/requests`,
  );
  const data = unwrap(res);
  return Array.isArray(data) ? data : [];
};

export const approveJoinRequest = async (groupUuid: string, userUuid: string) => {
  const res = await axios.post<ApiResponse<unknown>>(
    `/api/studies/groups/${groupUuid}/requests/${userUuid}/approve`,
  );
  return unwrap(res);
};

export const rejectJoinRequest = async (groupUuid: string, userUuid: string) => {
  const res = await axios.post<ApiResponse<unknown>>(
    `/api/studies/groups/${groupUuid}/requests/${userUuid}/reject`,
  );
  return unwrap(res);
};

export const patchStudyGroupStatus = async (groupUuid: string, status: StudyGroupRecruitStatus) => {
  const res = await axios.patch<ApiResponse<unknown>>(`/api/studies/groups/${groupUuid}/status`, {
    status,
  });
  return unwrap(res);
};

export const getStudyGroupMembers = async (groupUuid: string) => {
  const res = await axios.get<ApiResponse<StudyGroupMember[]>>(
    `/api/studies/groups/${groupUuid}/members`,
  );
  const data = unwrap(res);
  return Array.isArray(data) ? data : [];
};

export const kickStudyGroupMember = async (groupUuid: string, userUuid: string) => {
  const res = await axios.post<ApiResponse<unknown>>(`/api/studies/groups/${groupUuid}/kick`, {
    userUuid,
  });
  return unwrap(res);
};

export const leaveStudyGroup = async (groupUuid: string) => {
  const res = await axios.delete<ApiResponse<unknown>>(`/api/studies/groups/${groupUuid}/leave`);
  return unwrap(res);
};

export const delegateStudyGroupLeader = async (groupUuid: string, leaderUserUuid: string) => {
  const res = await axios.patch<ApiResponse<unknown>>(`/api/studies/groups/${groupUuid}`, {
    leaderUserUuid,
  });
  return unwrap(res);
};
