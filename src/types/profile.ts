/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SocialLinks {
  githubUrl?: string;
  notionUrl?: string;
  linkedinUrl?: string;
  personalWebsiteUrl?: string;
}

export interface profile {
  uuid: string;
  adminId: string;
  customId: string;
  userRealname: string;
  userNickname: string;
  useNickname: boolean;
  profileImage: string;
  profileBanner: string;
  role: string;
  intro: string;
  techStack: string[];
  badge: string | null;
  activityScore: number;
  contributionData: any;
  socialLinks?: SocialLinks;
}
