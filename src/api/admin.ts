import axios from './axios';

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface PagedResponse<T> {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: T[];
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdminUser {
  uuid: string;
  adminId: string;
  customId: string;
  userRealname: string;
  userNickname: string;
  role: 'ADMIN' | 'TEACHER' | 'USER';
  status: 'ACTIVE' | 'INACTIVE';
  profileImage: string;
  createdAt: string;
  coinBalance?: number;
  pointBalance?: number;
}

export interface Ban {
  banId: number;
  userUuid: string;
  userNickname: string;
  reason: string;
  banType: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  adminId: string;
}

export interface Report {
  reportId: number;
  reporterUuid: string;
  reporterNickname: string;
  targetUuid: string;
  targetNickname: string;
  contentType: string;
  contentId: number;
  reason: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface AdminPost {
  postUuid: string;
  writerUuid: string;
  seq: number;
  title: string;
  writer: string;
  writedAt: string;
  likes: number;
  views: number;
  comments: number;
  boardType: string;
  communityCategory: string;
  thumbnailImage: string | null;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  authorNickname: string;
  createdAt: string;
  updatedAt: string;
}

export interface TradeItem {
  itemId: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface TradeOrder {
  orderId: number;
  buyerNickname: string;
  itemName: string;
  price: number;
  status: 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface StudyGroup {
  groupUuid: string;
  name: string;
  description: string;
  techTags: string;
  category: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  status: 'OPEN' | 'CLOSED';
  capacity: number;
  ownerUuid: string;
  memberCount: number;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  totalPosts: number;
  totalComments: number;
  activeBans: number;
  totalGroups: number;
  totalTradeOrders: number;
  totalNotifications: number;
}

export interface NotificationHistory {
  id: number;
  type: string;
  title: string;
  message: string;
  postUuid: string | null;
  readAt: string | null;
  createdAt: string;
  senderUuid: string;
}

export interface S3Object {
  key: string;
  size: number;
  lastModified: string;
  isFolder: boolean;
}

export interface BalanceInfo {
  uuid: string;
  nickname: string;
  coinBalance: number;
  pointBalance: number;
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export const getAdminStats = () =>
  axios.get<{ data: AdminStats }>('/api/admin/stats/summary').then((r) => r.data.data);

// ─── Users ───────────────────────────────────────────────────────────────────

export const createAdminUser = (data: {
  adminId: string;
  password: string;
  userRealname: string;
  role: string;
}) => axios.post('/api/auth/admin/create', data).then((r) => r.data);

export const changeUserRole = (uuid: string, role: string) =>
  axios.patch(`/api/users/${uuid}/role`, { role }).then((r) => r.data);

export const changeUserStatus = (uuid: string, status: 'ACTIVE' | 'INACTIVE') =>
  axios.patch(`/api/users/${uuid}/status`, { status }).then((r) => r.data);

export const deleteUser = (uuid: string) =>
  axios.delete(`/api/users/${uuid}`).then((r) => r.data);

export const resetUserPassword = (uuid: string) =>
  axios.post(`/api/users/${uuid}/password/reset`).then((r) => r.data);

export const bulkCreateUsers = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post('/api/auth/admin/create/bulk', formData).then((r) => r.data);
};

export const getUserBalances = () =>
  axios.get<BalanceInfo[]>('/api/users/balances').then((r) => r.data);

// ─── Bans ─────────────────────────────────────────────────────────────────────

export const createBan = (data: {
  userUuid: string;
  reason: string;
  banType: string;
  duration?: number;
}) => axios.post('/api/bans', data).then((r) => r.data);

export const getBans = () => axios.get<Ban[]>('/api/bans').then((r) => r.data);

export const getUserBans = (userUuid: string) =>
  axios.get<Ban[]>(`/api/bans/users/${userUuid}`).then((r) => r.data);

export const releaseBan = (userUuid: string) =>
  axios.post(`/api/bans/${userUuid}/release`).then((r) => r.data);

export const releaseBanById = (banId: number) =>
  axios.post(`/api/bans/${banId}/release/manual`).then((r) => r.data);

export const getBanStats = () =>
  axios.get('/api/bans/stats').then((r) => r.data);

// ─── Reports ─────────────────────────────────────────────────────────────────

export const getReports = (status?: string) =>
  axios.get<Report[]>('/api/reports', { params: { status } }).then((r) => r.data);

export const updateReportStatus = (reportId: number, status: string) =>
  axios.patch(`/api/reports/${reportId}`, { status }).then((r) => r.data);

// ─── Posts & Comments ─────────────────────────────────────────────────────────

export const getAdminPosts = (params?: {
  page?: number;
  size?: number;
  q?: string;
  writerUuid?: string;
}) =>
  axios
    .get<{ data: PagedResponse<AdminPost> }>('/api/admin/posts', { params })
    .then((r) => r.data.data);

export const deleteUserPosts = (uuid: string) =>
  axios.delete(`/api/admin/posts/users/${uuid}`).then((r) => r.data);

export const deleteComment = (commentId: number) =>
  axios.delete(`/api/admin/comments/${commentId}`).then((r) => r.data);

// ─── Notices ─────────────────────────────────────────────────────────────────

export const createNotice = (data: { title: string; content: string }) =>
  axios.post('/api/notices', data).then((r) => r.data);

export const updateNotice = (id: number, data: { title: string; content: string }) =>
  axios.put(`/api/notices/${id}`, data).then((r) => r.data);

export const deleteNotice = (id: number) =>
  axios.delete(`/api/notices/${id}`).then((r) => r.data);

// ─── Coins & Points ───────────────────────────────────────────────────────────

export const adjustCoins = (data: {
  userUuid: string;
  amount: number;
  reason: string;
  type: 'ADD' | 'DEDUCT';
}) => axios.post('/api/coins/adjustments', data).then((r) => r.data);

export const adjustPoints = (data: {
  userUuid: string;
  amount: number;
  reason: string;
  type: 'ADD' | 'DEDUCT';
}) => axios.post('/api/points/adjustments', data).then((r) => r.data);

export const bulkAdjustCoins = (data: {
  role: string;
  amount: number;
  reason: string;
}) => axios.post('/api/coins/adjustments/bulk', data).then((r) => r.data);

export const getCoinHistory = () =>
  axios.get('/api/coins/adjustments/history').then((r) => r.data);

// ─── Shop & Trade ─────────────────────────────────────────────────────────────

export const createTradeItem = (data: FormData) =>
  axios.post('/api/trade/items', data).then((r) => r.data);

export const updateTradeItem = (itemId: number, data: Partial<TradeItem>) =>
  axios.patch(`/api/trade/items/${itemId}`, data).then((r) => r.data);

export const deleteTradeItem = (itemId: number) =>
  axios.delete(`/api/trade/items/${itemId}`).then((r) => r.data);

export const rechargeStock = (uuid: string, stock: number) =>
  axios.post(`/api/trade/items/${uuid}/stock`, { stock }).then((r) => r.data);

export const cancelOrder = (orderId: number) =>
  axios.post(`/api/trade/orders/${orderId}/cancel`).then((r) => r.data);

export const getOrderStats = () =>
  axios.get('/api/trade/orders/stats').then((r) => r.data);

export const getItemStats = () =>
  axios.get('/api/trade/items/stats').then((r) => r.data);

// ─── Notifications ────────────────────────────────────────────────────────────

export const sendNotification = (data: {
  title: string;
  message: string;
  targetRole?: string | null;
  postUuid?: string;
}) => axios.post('/api/admin/notifications/send', data).then((r) => r.data);

export const getNotificationHistory = (params?: { page?: number; size?: number }) =>
  axios
    .get<{ data: PagedResponse<NotificationHistory> }>('/api/admin/notifications/history', { params })
    .then((r) => r.data.data);

// ─── Study Groups ─────────────────────────────────────────────────────────────

export const getAdminGroups = (params?: { page?: number; size?: number }) =>
  axios
    .get<{ data: PagedResponse<StudyGroup> }>('/api/admin/groups', { params })
    .then((r) => r.data.data);

export const getGroupsByCategory = (id: string, params?: { page?: number; size?: number }) =>
  axios
    .get<{ data: PagedResponse<StudyGroup> }>(`/api/admin/groups/category/${id}`, { params })
    .then((r) => r.data.data);

export const dissolveGroup = (groupId: string) =>
  axios.post(`/api/admin/groups/${groupId}/dissolve`).then((r) => r.data);

export const removeGroupMember = (groupId: string, uuid: string) =>
  axios.delete(`/api/admin/groups/${groupId}/members/${uuid}`).then((r) => r.data);

// ─── S3 ──────────────────────────────────────────────────────────────────────

export const listS3Objects = (prefix?: string) =>
  axios.get<S3Object[]>('/api/admin/s3/list', { params: { prefix } }).then((r) => r.data);

export const deleteS3Object = (key: string) =>
  axios.delete('/api/admin/s3/delete', { data: { key } }).then((r) => r.data);

export const uploadS3File = (file: File, path: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('path', path);
  return axios.post('/api/admin/s3/upload', formData).then((r) => r.data);
};

export const createS3Folder = (path: string) =>
  axios.post('/api/admin/s3/mkdir', { path }).then((r) => r.data);
