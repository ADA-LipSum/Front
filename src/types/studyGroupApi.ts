/** LipSum 스터디 그룹 API 명세 기반 타입 */

export type StudyGroupVisibility = 'PUBLIC' | 'PRIVATE';
export type StudyGroupRecruitStatus = 'OPEN' | 'CLOSED';
export type StudyGroupJoinRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type StudyGroupMemberRole = 'LEADER' | 'MEMBER';
export type StudyGroupCategory = 'LANGUAGE_STUDY' | 'PROJECT_DEVELOPMENT';

export interface StudyGroupMemberBasic {
  userUuid: string;
  name: string;
  profileImage?: string;
}

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
  ownerProfileImage?: string;
  memberCount: number;
  thumbnailImage?: string;
  createdAt?: string;
  updatedAt?: string;
  isMember?: boolean;
  myRole?: string | null;
  members?: StudyGroupMemberBasic[];
}

/** 상세 조회 시 서버가 내려줄 수 있는 현재 사용자 컨텍스트 */
export interface StudyGroupDetail extends StudyGroupSummary {
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
  customId: string;
  profileImage?: string;
  status: StudyGroupJoinRequestStatus;
  requestedAt: string;
  applicantCustomId?: string;
}

export interface CreateStudyGroupBody {
  name: string;
  description?: string;
  techTags?: string;
  category: StudyGroupCategory;
  visibility: StudyGroupVisibility;
  capacity: number;
  inviteLink?: string;
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
