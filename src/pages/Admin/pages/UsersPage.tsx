import { useState } from 'react';
import { MoreHorizontal, UserPlus, Search, Upload, ShieldCheck, KeyRound, UserX, Trash2 } from 'lucide-react';
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

interface MockUser {
  uuid: string;
  adminId: string;
  nickname: string;
  role: 'ADMIN' | 'TEACHER' | 'USER';
  status: 'ACTIVE' | 'INACTIVE';
  profileImage: string;
  coinBalance: number;
  pointBalance: number;
}

const INITIAL_USERS: MockUser[] = [
  { uuid: 'uuid-001', adminId: 'admin01', nickname: '관리자A', role: 'ADMIN', status: 'ACTIVE', profileImage: '', coinBalance: 9999, pointBalance: 9999 },
  { uuid: 'uuid-002', adminId: 'teacher01', nickname: '김선생', role: 'TEACHER', status: 'ACTIVE', profileImage: '', coinBalance: 500, pointBalance: 1200 },
  { uuid: 'uuid-003', adminId: 'user01', nickname: '홍길동', role: 'USER', status: 'ACTIVE', profileImage: '', coinBalance: 120, pointBalance: 340 },
  { uuid: 'uuid-004', adminId: 'user02', nickname: '이순신', role: 'USER', status: 'ACTIVE', profileImage: '', coinBalance: 80, pointBalance: 210 },
  { uuid: 'uuid-005', adminId: 'user03', nickname: '강감찬', role: 'USER', status: 'INACTIVE', profileImage: '', coinBalance: 0, pointBalance: 50 },
  { uuid: 'uuid-006', adminId: 'user04', nickname: '세종대왕', role: 'USER', status: 'ACTIVE', profileImage: '', coinBalance: 450, pointBalance: 1100 },
];

const ROLE_LABELS: Record<string, string> = { ADMIN: '관리자', TEACHER: '선생님', USER: '일반 사용자' };
const ROLE_VARIANTS: Record<string, 'default' | 'secondary' | 'outline'> = { ADMIN: 'default', TEACHER: 'secondary', USER: 'outline' };

export default function UsersPage() {
  const [users, setUsers] = useState<MockUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteUuid, setDeleteUuid] = useState<string | null>(null);
  const [roleTarget, setRoleTarget] = useState<{ uuid: string; current: string } | null>(null);
  const [form, setForm] = useState({ adminId: '', password: '', userRealname: '', role: 'USER' });

  const filtered = users.filter(
    (u) => !search || u.nickname.toLowerCase().includes(search.toLowerCase()) || u.uuid.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = () => {
    const newUser: MockUser = {
      uuid: `uuid-${Date.now()}`,
      adminId: form.adminId,
      nickname: form.userRealname || form.adminId,
      role: form.role as MockUser['role'],
      status: 'ACTIVE',
      profileImage: '',
      coinBalance: 0,
      pointBalance: 0,
    };
    setUsers((prev) => [newUser, ...prev]);
    toast.success('사용자를 생성했습니다.');
    setCreateOpen(false);
    setForm({ adminId: '', password: '', userRealname: '', role: 'USER' });
  };

  const handleRoleChange = (uuid: string, role: string) => {
    setUsers((prev) => prev.map((u) => u.uuid === uuid ? { ...u, role: role as MockUser['role'] } : u));
    toast.success('권한을 변경했습니다.');
    setRoleTarget(null);
  };

  const handleStatusToggle = (uuid: string) => {
    setUsers((prev) => prev.map((u) => u.uuid === uuid ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : u));
    toast.success('상태를 변경했습니다.');
  };

  const handleDelete = (uuid: string) => {
    setUsers((prev) => prev.filter((u) => u.uuid !== uuid));
    toast.success('계정을 삭제했습니다.');
    setDeleteUuid(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">사용자 관리</h1>
          <p className="text-sm text-muted-foreground mt-0.5">전체 사용자 목록 및 잔액을 확인합니다.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />CSV 일괄 생성
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />사용자 생성
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="닉네임 또는 UUID로 검색..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm h-8" />
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
              {filtered.map((user) => (
                <TableRow key={user.uuid}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profileImage} />
                        <AvatarFallback className="text-xs">{user.nickname.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{user.nickname}</div>
                        <div className="text-xs text-muted-foreground">{user.adminId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ROLE_VARIANTS[user.role]}>{ROLE_LABELS[user.role]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {user.status === 'ACTIVE' ? '활성' : '비활성'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-right font-mono">{user.coinBalance.toLocaleString()} C</TableCell>
                  <TableCell className="text-sm text-right font-mono">{user.pointBalance.toLocaleString()} P</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent focus-visible:outline-none">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setRoleTarget({ uuid: user.uuid, current: user.role })}>
                          <ShieldCheck className="mr-2 h-4 w-4" />권한 변경
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success('비밀번호를 초기화했습니다.')}>
                          <KeyRound className="mr-2 h-4 w-4" />비밀번호 초기화
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusToggle(user.uuid)}>
                          <UserX className="mr-2 h-4 w-4" />
                          {user.status === 'ACTIVE' ? '비활성화' : '활성화'}
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => setDeleteUuid(user.uuid)}>
                          <Trash2 className="mr-2 h-4 w-4" />계정 삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">검색 결과가 없습니다.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
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
              <Label>초기 비밀번호</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="초기 비밀번호" />
            </div>
            <div className="space-y-1.5">
              <Label>역할</Label>
              <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v ?? 'USER' }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">일반 사용자</SelectItem>
                  <SelectItem value="TEACHER">선생님</SelectItem>
                  <SelectItem value="ADMIN">관리자</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>취소</Button>
            <Button onClick={handleCreate} disabled={!form.adminId || !form.password}>생성</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Change Dialog */}
      {roleTarget && (
        <Dialog open onOpenChange={() => setRoleTarget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>권한 변경</DialogTitle>
              <DialogDescription>사용자의 역할을 변경합니다.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select defaultValue={roleTarget.current} onValueChange={(v) => v && handleRoleChange(roleTarget.uuid, v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">일반 사용자</SelectItem>
                  <SelectItem value="TEACHER">선생님</SelectItem>
                  <SelectItem value="ADMIN">관리자</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRoleTarget(null)}>닫기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteUuid} onOpenChange={() => setDeleteUuid(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>계정을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => deleteUuid && handleDelete(deleteUuid)}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
