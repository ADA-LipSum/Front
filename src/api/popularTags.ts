import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string | null;
}

export interface PopularTag {
  tag: string;
  count: number;
}

export const getPopularTags = async (): Promise<PopularTag[]> => {
  const res = await axios.get<ApiResponse<PopularTag[]>>('/api/community/widget/popular-tags');
  return res.data.data;
};
