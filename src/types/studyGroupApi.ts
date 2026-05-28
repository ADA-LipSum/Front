/** LipSum 스터디 그룹 API 명세 기반 타입 */

export type StudyGroupVisibility = 'PUBLIC' | 'PRIVATE';
export type StudyGroupRecruitStatus = 'OPEN' | 'CLOSED';
export type StudyGroupJoinRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type StudyGroupMemberRole = 'LEADER' | 'MEMBER';

export interface StudyGroupSummary {
  groupUuid: string;
  name: string;
  description: string;
  techTags: string;
  visibility: StudyGroupVisibility;
  status: StudyGroupRecruitStatus;
  capacity: number;
  ownerUuid: string;
  ownerCustomId: string;
  memberCount: number;
}

/** 상세 조회 시 서버가 내려줄 수 있는 현재 사용자 컨텍스트 */
export interface StudyGroupDetail extends StudyGroupSummary {
  isMember?: boolean;
  myRole?: StudyGroupMemberRole | null;
  myJoinRequestStatus?: StudyGroupJoinRequestStatus | null;
}

export interface StudyGroupMember {
  userUuid: string;
  customId: string;
  role: StudyGroupMemberRole;
  joinedAt: string;
  profileImage?: string;
}

export interface StudyGroupJoinRequest {
  userUuid: string;
  status: StudyGroupJoinRequestStatus;
  requestedAt: string;
  applicantCustomId?: string;
}

export interface CreateStudyGroupBody {
  name: string;
  description: string;
  techTags: string;
  visibility: StudyGroupVisibility;
  capacity: number;
}

export interface CreateStudyGroupResponse {
  groupUuid: string;
}

export interface StudyGroupListParams {
  keyword?: string;
  techTags?: string;
  status?: StudyGroupRecruitStatus;
  visibility?: StudyGroupVisibility;
  page?: number;
  size?: number;
}

export interface StudyGroupListResult {
  content: StudyGroupSummary[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
