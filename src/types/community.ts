export type RecruitStatus = 'recruiting' | 'closed';

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId?: string;
  createdAt: string; // ISO string
  tags: string[];
  status: RecruitStatus;
  avatarSrc?: string;
  likes?: number;
  views?: number;
  commentsCount?: number;
  isDev?: boolean;
  seq?: number;
}

export interface CommunityComment {
  id: string;
  postId: string;
  author: string;
  authorId?: string;
  content: string;
  createdAt: string;
  avatarSrc?: string;
}

export type TabType = '전체' | '모집중' | '모집완료';
