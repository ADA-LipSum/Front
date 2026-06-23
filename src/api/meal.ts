import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string | null;
}

export interface MealInfo {
  menus: string[];
  calorie: string;
}

export interface SchoolMealResponse {
  date: string;
  breakfast: MealInfo | null;
  lunch: MealInfo | null;
  dinner: MealInfo | null;
}

export const getMeal = async (date?: string): Promise<SchoolMealResponse> => {
  const params = date ? { date } : {};
  const res = await axios.get<ApiResponse<SchoolMealResponse>>('/api/meal', { params });
  return res.data.data;
};
