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
    totalElements: obj.totalElements ?? obj.content?.length ?? 0,
    number: obj.number ?? page,
    size: obj.size ?? size,
  };
}

// 스터디 그룹 생성 & 썸네일 업로드 포함
export const createStudyGroup = async (body: CreateStudyGroupBody, thumbnail?: File | null) => {
  const formData = new FormData();
  formData.append('request', new Blob([JSON.stringify(body)], { type: 'application/json' }));

  if (thumbnail) {
    formData.append('thumbnail', thumbnail);
  }

  const response = await axios.post<ApiResponse<CreateStudyGroupResponse>>(
    '/api/studies/groups',
    formData,
  );
  return response.data.data;
};

export const getStudyGroups = async (params: StudyGroupListParams) => {
  const page = params.page ?? 0;
  const size = params.size ?? 10;
  const res = await axios.get<ApiResponse<unknown>>('/api/studies/groups', {
    params: { ...params, page, size },
  });
  const raw = res.data.data;
  return normalizeListPayload(raw, page, size);
};

export const getStudyGroupDetail = async (groupUuid: string) => {
  const res = await axios.get<ApiResponse<StudyGroupDetail>>(`/api/studies/groups/${groupUuid}`);
  return res.data.data;
};

export const requestJoinStudyGroup = async (groupUuid: string) => {
  const res = await axios.post<ApiResponse<unknown>>(`/api/studies/groups/${groupUuid}/join`);
  return res.data.data;
};

export const cancelMyJoinRequest = async (groupUuid: string) => {
  const res = await axios.delete<ApiResponse<unknown>>(
    `/api/studies/groups/${groupUuid}/requests/my`,
  );
  return res.data.data;
};

export const getJoinRequests = async (groupUuid: string) => {
  const res = await axios.get<ApiResponse<StudyGroupJoinRequest[]>>(
    `/api/studies/groups/${groupUuid}/requests`,
  );
  const data = res.data.data;
  return Array.isArray(data) ? data : [];
};

export const approveJoinRequest = async (groupUuid: string, userUuid: string) => {
  const res = await axios.post<ApiResponse<unknown>>(
    `/api/studies/groups/${groupUuid}/requests/${userUuid}/approve`,
  );
  return res.data.data;
};

export const rejectJoinRequest = async (groupUuid: string, userUuid: string) => {
  const res = await axios.post<ApiResponse<unknown>>(
    `/api/studies/groups/${groupUuid}/requests/${userUuid}/reject`,
  );
  return res.data.data;
};

export const patchStudyGroupStatus = async (groupUuid: string, status: StudyGroupRecruitStatus) => {
  const res = await axios.patch<ApiResponse<unknown>>(`/api/studies/groups/${groupUuid}/status`, {
    status,
  });
  return res.data.data;
};

export const getStudyGroupMembers = async (groupUuid: string) => {
  const res = await axios.get<ApiResponse<StudyGroupMember[]>>(
    `/api/studies/groups/${groupUuid}/members`,
  );
  const data = res.data.data;
  return Array.isArray(data) ? data : [];
};

export const kickStudyGroupMember = async (groupUuid: string, userUuid: string) => {
  const res = await axios.post<ApiResponse<unknown>>(`/api/studies/groups/${groupUuid}/kick`, {
    userUuid,
  });
  return res.data.data;
};

export const leaveStudyGroup = async (groupUuid: string) => {
  const res = await axios.delete<ApiResponse<unknown>>(`/api/studies/groups/${groupUuid}/leave`);
  return res.data.data;
};

export const delegateStudyGroupLeader = async (groupUuid: string, leaderUserUuid: string) => {
  const res = await axios.patch<ApiResponse<unknown>>(`/api/studies/groups/${groupUuid}`, {
    leaderUserUuid,
  });
  return res.data.data;
};
