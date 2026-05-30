import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string | null;
}

interface InventoryListResponse {
  inventoryUuid: string;
  itemUuid: string;
  itemName: string;
  imageUrl: string;
  category: string;
  subCategory: string;
  acquiredAt?: string;
}

export const fetchInventoryList = async (uuid: string): Promise<InventoryListResponse[]> => {
  try {
    const response = await axios.get<ApiResponse<InventoryListResponse[]>>(
      `/api/users/${uuid}/inventory`,
      {
        params: { uuid },
      },
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || '인벤토리 목록 조회 실패');
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '인벤토리 목록 조회 실패');
  }
};
