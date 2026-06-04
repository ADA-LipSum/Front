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
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'MENTOR';
  active: boolean;
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

export interface BanStat {
  banType: string;
  count: number;
  activeCount: number;
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
  itemUuid: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  active: boolean;
  createdAt: string;
}

export interface TradeOrder {
  orderId: string;
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

export interface CoinHistory {
  coinUuid: string;
  userUuid: string;
  changeType: 'GAIN' | 'LOSS';
  coins: number;
  balanceAfter: number;
  description: string;
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
  adminId: string;
  customId: string;
  userRealname: string;
  userNickname: string;
  coinBalance: number;
  pointBalance: number;
}

export interface Banner {
  bannerId: number;
  imageUrl: string;
  targetUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

// ─── Dev logger ───────────────────────────────────────────────────────────────

const tap = <T>(label: string) => (data: T): T => {
  console.log(`[admin] ${label}`, data);
  return data;
};

// ─── Stats ───────────────────────────────────────────────────────────────────

export const getAdminStats = () =>
  axios.get<{ data: AdminStats }>('/api/admin/stats/summary').then((r) => r.data.data).then(tap('getAdminStats'));

export const resequenceTable = (table: string) =>
  axios.post(`/api/admin/resequence/${table}`).then((r) => r.data).then(tap(`resequenceTable(${table})`));

// ─── Users ────────────────────────────────────────────────────────────────────

export const getAdminUsers = (params?: { role?: string; q?: string }) =>
  axios.get<{ data: AdminUser[] }>('/api/users', { params }).then((r) => r.data.data).then(tap('getAdminUsers'));

export const createAdminUser = (data: {
  adminId: string;
  password: string;
  userRealname: string;
  userNickname: string;
  role: string;
}) => axios.post('/api/auth/admin/create', data).then((r) => r.data).then(tap('createAdminUser'));

export const changeUserRole = (uuid: string, role: string) =>
  axios.patch(`/api/users/${uuid}/role`, { role }).then((r) => r.data).then(tap(`changeUserRole(${uuid}, ${role})`));

export const changeUserStatus = (uuid: string, active: boolean) =>
  axios.patch(`/api/users/${uuid}/status`, { active }).then((r) => r.data).then(tap(`changeUserStatus(${uuid}, ${active})`));

export const deleteUser = (uuid: string) =>
  axios.delete(`/api/users/${uuid}`).then((r) => r.data).then(tap(`deleteUser(${uuid})`));

export const resetUserPassword = (uuid: string, newPassword: string) =>
  axios.post(`/api/users/${uuid}/password/reset`, { newPassword }).then((r) => r.data).then(tap(`resetUserPassword(${uuid})`));

export const bulkCreateUsers = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post('/api/auth/admin/create/bulk', formData).then((r) => r.data).then(tap('bulkCreateUsers'));
};

export const getUserBalances = () =>
  axios.get<{ data: BalanceInfo[] }>('/api/users/balances').then((r) => r.data.data).then(tap('getUserBalances'));

// ─── Bans ─────────────────────────────────────────────────────────────────────

export const createBan = (data: {
  userUuid: string;
  reason: string;
  banType: string;
  duration?: number;
}) => axios.post('/api/bans', data).then((r) => r.data).then(tap('createBan'));

export const getBans = () =>
  axios.get<{ data: Ban[] }>('/api/bans').then((r) => {
    const d = r.data.data;
    console.log('[admin] getBans raw response:', r.data);
    return Array.isArray(d) ? d : [];
  }).then(tap('getBans'));

export const getUserBans = (userUuid: string) =>
  axios.get<{ data: Ban[] }>(`/api/bans/users/${userUuid}`).then((r) => r.data.data).then(tap(`getUserBans(${userUuid})`));

export const releaseBan = (userUuid: string) =>
  axios.post(`/api/bans/${userUuid}/release`).then((r) => r.data).then(tap(`releaseBan(${userUuid})`));

export const releaseBanById = (banId: number) =>
  axios.post(`/api/bans/${banId}/release/manual`).then((r) => r.data).then(tap(`releaseBanById(${banId})`));

export const getBanStats = () =>
  axios.get<{ data: BanStat[] }>('/api/bans/stats').then((r) => r.data.data).then(tap('getBanStats'));

// ─── Reports ─────────────────────────────────────────────────────────────────

export const getReports = (status?: string) =>
  axios.get<{ data: Report[] }>('/api/reports', { params: { status } }).then((r) => r.data.data).then(tap(`getReports(${status})`));

export const updateReportStatus = (reportId: number, status: string) =>
  axios.patch(`/api/reports/${reportId}`, { status }).then((r) => r.data).then(tap(`updateReportStatus(${reportId}, ${status})`));

// ─── Posts & Comments ─────────────────────────────────────────────────────────

export const getAdminPosts = (params?: {
  page?: number;
  size?: number;
  q?: string;
  writerUuid?: string;
}) =>
  axios
    .get<{ data: PagedResponse<AdminPost> }>('/api/admin/posts', { params })
    .then((r) => r.data.data)
    .then(tap('getAdminPosts'));

export const deleteUserPosts = (uuid: string) =>
  axios.delete(`/api/admin/posts/users/${uuid}`).then((r) => r.data).then(tap(`deleteUserPosts(${uuid})`));

export interface AdminComment {
  commentId: number;
  content: string;
  writerNickname: string;
  writerUuid: string;
  createdAt: string;
  parentCommentId: number | null;
  likes: number;
}

export const getPostComments = (postUuid: string) =>
  axios
    .get<{ data: AdminComment[] }>(`/api/admin/posts/${postUuid}/comments`)
    .then((r) => r.data.data)
    .then(tap(`getPostComments(${postUuid})`));

export const deleteComment = (commentId: number) =>
  axios.delete(`/api/admin/comments/${commentId}`).then((r) => r.data).then(tap(`deleteComment(${commentId})`));

// ─── Notices ─────────────────────────────────────────────────────────────────

export const getNotices = () =>
  axios.get<Notice[]>('/api/notices').then((r) => r.data).then(tap('getNotices'));

export const createNotice = (data: { title: string; content: string }) =>
  axios.post('/api/notices', data).then((r) => r.data).then(tap('createNotice'));

export const updateNotice = (id: number, data: { title: string; content: string }) =>
  axios.put(`/api/notices/${id}`, data).then((r) => r.data).then(tap(`updateNotice(${id})`));

export const deleteNotice = (id: number) =>
  axios.delete(`/api/notices/${id}`).then((r) => r.data).then(tap(`deleteNotice(${id})`));

// ─── Coins & Points ───────────────────────────────────────────────────────────

export const adjustCoins = (data: {
  userUuid: string;
  amount: number;
  reason: string;
  type: 'ADD' | 'DEDUCT';
}) => axios.post('/api/coins/adjustments', data).then((r) => r.data).then(tap('adjustCoins'));

export const adjustPoints = (data: {
  userUuid: string;
  amount: number;
  reason: string;
  type: 'ADD' | 'DEDUCT';
}) => axios.post('/api/points/adjustments', data).then((r) => r.data).then(tap('adjustPoints'));

export const bulkAdjustCoins = (data: {
  role: string;
  type: 'GAIN' | 'LOSS';
  coins: number;
  description?: string;
}) => axios.post('/api/coins/adjustments/bulk', data).then((r) => r.data).then(tap('bulkAdjustCoins'));

export const getCoinHistory = (params?: { page?: number; size?: number }) =>
  axios
    .get<{ data: PagedResponse<CoinHistory> }>('/api/coins/adjustments/history', { params })
    .then((r) => r.data.data)
    .then(tap('getCoinHistory'));

// ─── Shop & Trade ─────────────────────────────────────────────────────────────

export const getTradeItems = () =>
  axios.get<{ data: TradeItem[] }>('/api/trade/items').then((r) => r.data.data).then(tap('getTradeItems'));

export const getTradeOrders = (params?: { page?: number; size?: number }) =>
  axios
    .get<{ data: PagedResponse<TradeOrder> }>('/api/trade/orders', { params })
    .then((r) => r.data.data)
    .then(tap('getTradeOrders'));

export const createTradeItem = (data: {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  active?: boolean;
  category: 'FOOD' | 'ETC';
  subCategory?: 'SNACK' | 'CANDY' | 'JUICE' | 'INSTANT' | 'STICKER' | 'BANNER';
  imageUrl?: string;
}) => axios.post('/api/trade/items', data).then((r) => r.data).then(tap('createTradeItem'));

export const updateTradeItem = (itemUuid: string, data: Partial<Pick<TradeItem, 'name' | 'description' | 'price' | 'active'>>) =>
  axios.patch(`/api/trade/items/${itemUuid}`, data).then((r) => r.data).then(tap(`updateTradeItem(${itemUuid})`));

export const deleteTradeItem = (itemUuid: string) =>
  axios.delete(`/api/trade/items/${itemUuid}`).then((r) => r.data).then(tap(`deleteTradeItem(${itemUuid})`));

export const rechargeStock = (itemUuid: string, stock: number) =>
  axios.post(`/api/trade/items/${itemUuid}/stock`, { stock }).then((r) => r.data).then(tap(`rechargeStock(${itemUuid}, ${stock})`));

export const cancelOrder = (orderId: string) =>
  axios.post(`/api/trade/orders/${orderId}/cancel`).then((r) => r.data).then(tap(`cancelOrder(${orderId})`));

export const getOrderStats = () =>
  axios.get('/api/trade/orders/stats').then((r) => r.data).then(tap('getOrderStats'));

export const getItemStats = () =>
  axios.get('/api/trade/items/stats').then((r) => r.data).then(tap('getItemStats'));

// ─── Notifications ────────────────────────────────────────────────────────────

export const sendNotification = (data: {
  title: string;
  message: string;
  targetRole?: string | null;
  postUuid?: string;
}) => axios.post('/api/admin/notifications/send', data).then((r) => r.data).then(tap('sendNotification'));

export const getNotificationHistory = (params?: { page?: number; size?: number }) =>
  axios
    .get<{ data: PagedResponse<NotificationHistory> }>('/api/admin/notifications/history', { params })
    .then((r) => r.data.data)
    .then(tap('getNotificationHistory'));

// ─── Study Groups ─────────────────────────────────────────────────────────────

export const getAdminGroups = (params?: { page?: number; size?: number }) =>
  axios
    .get<{ data: PagedResponse<StudyGroup> }>('/api/admin/groups', { params })
    .then((r) => r.data.data)
    .then(tap('getAdminGroups'));

export const getGroupsByCategory = (id: string, params?: { page?: number; size?: number }) =>
  axios
    .get<{ data: PagedResponse<StudyGroup> }>(`/api/admin/groups/category/${id}`, { params })
    .then((r) => r.data.data)
    .then(tap(`getGroupsByCategory(${id})`));

export const dissolveGroup = (groupId: string) =>
  axios.post(`/api/admin/groups/${groupId}/dissolve`).then((r) => r.data).then(tap(`dissolveGroup(${groupId})`));

export const removeGroupMember = (groupId: string, uuid: string) =>
  axios.delete(`/api/admin/groups/${groupId}/members/${uuid}`).then((r) => r.data).then(tap(`removeGroupMember(${groupId}, ${uuid})`));

// ─── S3 ──────────────────────────────────────────────────────────────────────

export const listS3Objects = (prefix?: string) =>
  axios.get<S3Object[]>('/api/admin/s3/list', { params: { prefix } }).then((r) => r.data).then(tap(`listS3Objects(${prefix})`));

export const deleteS3Object = (key: string) =>
  axios.delete('/api/admin/s3/delete', { data: { key } }).then((r) => r.data).then(tap(`deleteS3Object(${key})`));

export const uploadS3File = (file: File, path: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('path', path);
  return axios.post('/api/admin/s3/upload', formData).then((r) => r.data).then(tap(`uploadS3File(${path})`));
};

export const createS3Folder = (path: string) =>
  axios.post('/api/admin/s3/mkdir', { path }).then((r) => r.data).then(tap(`createS3Folder(${path})`));

// ─── Community Banners ────────────────────────────────────────────────────────

export const getAllBanners = () =>
  axios.get<{ data: Banner[] }>('/api/community/banners').then((r) => r.data.data).then(tap('getAllBanners'));

export const createBanner = (data: FormData) =>
  axios.post('/api/community/banners', data).then((r) => r.data).then(tap('createBanner'));

export const updateBanner = (bannerId: number, data: Partial<Pick<Banner, 'targetUrl' | 'isActive'>>) =>
  axios.patch(`/api/community/banners/${bannerId}`, data).then((r) => r.data).then(tap(`updateBanner(${bannerId})`));

export const deleteBanner = (bannerId: number) =>
  axios.delete(`/api/community/banners/${bannerId}`).then((r) => r.data).then(tap(`deleteBanner(${bannerId})`));
