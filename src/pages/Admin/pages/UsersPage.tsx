import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal, UserPlus, Search, Upload, ShieldCheck, KeyRound, UserX, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'react-toastify';
import {
  getAdminUsers, createAdminUser, bulkCreateUsers, changeUserRole, changeUserStatus,
  resetUserPassword, deleteUser, type AdminUser,
} from '@/api/admin';

const ROLE_LABELS: Record<string, string> = { ADMIN: '관리자', TEACHER: '선생님', STUDENT: '학생', MENTOR: '멘토' };
const ROLE_VARIANTS: Record<string, 'default' | 'secondary' | 'outline'> = {
  ADMIN: 'default', TEACHER: 'secondary', STUDENT: 'outline', MENTOR: 'outline',
};

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [roleTarget, setRoleTarget] = useState<AdminUser | null>(null);
  const [newRole, setNewRole] = useState('');
  const [changingRole, setChangingRole] = useState(false);
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);
  const [togglingUuid, setTogglingUuid] = useState<string | null>(null);
  const [form, setForm] = useState({ adminId: '', password: '', userRealname: '', userNickname: '', role: 'STUDENT' });
  const csvRef = useRef<HTMLInputElement>(null);

  const loadUsers = () => {
    setLoading(true);
    getAdminUsers()
      .then(setUsers)
      .catch(() => toast.error('사용자 목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const filtered = users.filter((u) => {
    const matchSearch = !search
      || u.userNickname.toLowerCase().includes(search.toLowerCase())
      || u.adminId.toLowerCase().includes(search.toLowerCase())
      || u.uuid.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleCreate = async () => {
    if (!form.adminId || !form.password) return;
    if (form.password.length < 6) {
      toast.error('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    setCreating(true);
    try {
      await createAdminUser(form);
      toast.success('사용자를 생성했습니다.');
      setCreateOpen(false);
      setForm({ adminId: '', password: '', userRealname: '', userNickname: '', role: 'STUDENT' });
      loadUsers();
    } catch {
      toast.error('사용자 생성에 실패했습니다.');
    } finally {
      setCreating(false);
    }
  };

  const handleBulkCreate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await bulkCreateUsers(file);
      toast.success('일괄 생성이 완료됐습니다.');
      loadUsers();
    } catch {
      toast.error('일괄 생성에 실패했습니다.');
    } finally {
      if (csvRef.current) csvRef.current.value = '';
    }
  };

  const handleRoleChange = async () => {
    if (!roleTarget || !newRole) return;
    setChangingRole(true);
    try {
      await changeUserRole(roleTarget.uuid, newRole);
      toast.success('권한을 변경했습니다.');
      setRoleTarget(null);
      loadUsers();
    } catch {
      toast.error('권한 변경에 실패했습니다.');
    } finally {
      setChangingRole(false);
    }
  };

  const handleStatusToggle = async (user: AdminUser) => {
    setTogglingUuid(user.uuid);
    try {
      await changeUserStatus(user.uuid, !user.active);
      toast.success(`계정을 ${user.active ? '비활성화' : '활성화'}했습니다.`);
      loadUsers();
    } catch {
      toast.error('상태 변경에 실패했습니다.');
    } finally {
      setTogglingUuid(null);
    }
  };

  const handleResetPassword = async () => {
    if (!resetTarget || !newPassword.trim()) return;
    setResetting(true);
    try {
      await resetUserPassword(resetTarget.uuid, newPassword.trim());
      toast.success('비밀번호를 초기화했습니다.');
      setResetTarget(null);
      setNewPassword('');
    } catch {
      toast.error('비밀번호 초기화에 실패했습니다.');
    } finally {
      setResetting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUser(deleteTarget.uuid);
      toast.success('계정을 삭제했습니다.');
      setDeleteTarget(null);
      loadUsers();
    } catch {
      toast.error('계정 삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">사용자 관리</h1>
          <p className="text-sm text-muted-foreground mt-0.5">전체 사용자 목록 및 잔액을 확인합니다.</p>
        </div>
        <div className="flex gap-2">
          <input ref={csvRef} type="file" accept=".csv" className="hidden" onChange={handleBulkCreate} />
          <Button variant="outline" size="sm" onClick={() => csvRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />CSV 일괄 생성
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />사용자 생성
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative min-w-[220px] max-w-sm">
                <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="닉네임, 아이디 또는 UUID 검색..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8" />
              </div>
              <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v ?? 'all')}>
                <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 역할</SelectItem>
                  <SelectItem value="ADMIN">관리자</SelectItem>
                  <SelectItem value="TEACHER">선생님</SelectItem>
                  <SelectItem value="STUDENT">학생</SelectItem>
                  <SelectItem value="MENTOR">멘토</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{filtered.length.toLocaleString()}명</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={loadUsers} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사용자</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">코인</TableHead>
                <TableHead className="text-right">포인트</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">사용자가 없습니다.</TableCell>
                </TableRow>
              ) : (
                filtered.map((user) => (
                  <TableRow key={user.uuid}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profileImage} />
                          <AvatarFallback className="text-xs">{user.userNickname.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{user.userNickname}</div>
                          <div className="text-xs text-muted-foreground">{user.adminId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ROLE_VARIANTS[user.role] ?? 'outline'}>{ROLE_LABELS[user.role] ?? user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.active ? 'default' : 'secondary'}>
                        {user.active ? '활성' : '비활성'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-right font-mono">{(user.coinBalance ?? 0).toLocaleString()} C</TableCell>
                    <TableCell className="text-sm text-right font-mono">{(user.pointBalance ?? 0).toLocaleString()} P</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent focus-visible:outline-none">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setRoleTarget(user); setNewRole(user.role); }}>
                            <ShieldCheck className="mr-2 h-4 w-4" />권한 변경
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setResetTarget(user); setNewPassword(''); }}>
                            <KeyRound className="mr-2 h-4 w-4" />비밀번호 초기화
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusToggle(user)} disabled={togglingUuid === user.uuid}>
                            <UserX className="mr-2 h-4 w-4" />
                            {user.active ? '비활성화' : '활성화'}
                          </DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(user)}>
                            <Trash2 className="mr-2 h-4 w-4" />계정 삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 사용자 생성 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 생성</DialogTitle>
            <DialogDescription>관리자가 직접 계정을 생성합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>아이디</Label>
              <Input value={form.adminId} onChange={(e) => setForm((f) => ({ ...f, adminId: e.target.value }))} placeholder="로그인 아이디" />
            </div>
            <div className="space-y-1.5">
              <Label>실명</Label>
              <Input value={form.userRealname} onChange={(e) => setForm((f) => ({ ...f, userRealname: e.target.value }))} placeholder="실명" />
            </div>
            <div className="space-y-1.5">
              <Label>닉네임</Label>
              <Input value={form.userNickname} onChange={(e) => setForm((f) => ({ ...f, userNickname: e.target.value }))} placeholder="닉네임" />
            </div>
            <div className="space-y-1.5">
              <Label>초기 비밀번호</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="6자 이상" />
              {form.password.length > 0 && form.password.length < 6 && (
                <p className="text-xs text-destructive">비밀번호는 6자 이상이어야 합니다.</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>역할</Label>
              <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v ?? 'STUDENT' }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">학생</SelectItem>
                  <SelectItem value="MENTOR">멘토</SelectItem>
                  <SelectItem value="TEACHER">선생님</SelectItem>
                  <SelectItem value="ADMIN">관리자</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>취소</Button>
            <Button onClick={handleCreate} disabled={!form.adminId || form.password.length < 6 || creating}>
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}생성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 권한 변경 */}
      <Dialog open={!!roleTarget} onOpenChange={() => setRoleTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>권한 변경</DialogTitle>
            <DialogDescription>'{roleTarget?.userNickname}' 사용자의 역할을 변경합니다.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={(v) => v && setNewRole(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="STUDENT">학생</SelectItem>
                <SelectItem value="MENTOR">멘토</SelectItem>
                <SelectItem value="TEACHER">선생님</SelectItem>
                <SelectItem value="ADMIN">관리자</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleTarget(null)}>취소</Button>
            <Button onClick={handleRoleChange} disabled={!newRole || changingRole}>
              {changingRole && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}변경
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 비밀번호 초기화 */}
      <Dialog open={!!resetTarget} onOpenChange={() => { setResetTarget(null); setNewPassword(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>비밀번호 초기화</DialogTitle>
            <DialogDescription>'{resetTarget?.userNickname}' 계정의 비밀번호를 초기화합니다.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-1.5">
            <Label>새 비밀번호</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setResetTarget(null); setNewPassword(''); }}>취소</Button>
            <Button onClick={handleResetPassword} disabled={!newPassword.trim() || resetting}>
              {resetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}초기화
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 계정 삭제 */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>'{deleteTarget?.userNickname}' 계정을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
