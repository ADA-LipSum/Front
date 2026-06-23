import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string | null;
}

export interface CommunityMyStats {
  userUuid: string;
  realName: string;
  nickname: string;
  profileImage: string;
  postCount: number;
  receivedLikes: number;
  commentCount: number;
  receivedReactions: number;
  weeklyActivity: number[];
}

export const getCommunityMyStats = async (): Promise<CommunityMyStats> => {
  const res = await axios.get<ApiResponse<CommunityMyStats>>('/api/community/widget/my-stats');
  return res.data.data;
};
