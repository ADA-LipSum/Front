import { useState } from 'react';
import { ShieldPlus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';

interface MockBan {
  banId: number;
  userUuid: string;
  userNickname: string;
  reason: string;
  banType: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
}

const INITIAL_BANS: MockBan[] = [
  { banId: 1, userUuid: 'uuid-005', userNickname: '강감찬', reason: '스팸 게시글 반복 작성', banType: 'TEMPORARY', startDate: '2024-01-10', endDate: '2024-01-17', isActive: true },
  { banId: 2, userUuid: 'uuid-007', userNickname: '테스트유저1', reason: '욕설 및 혐오 발언', banType: 'PERMANENT', startDate: '2024-01-05', endDate: null, isActive: true },
  { banId: 3, userUuid: 'uuid-009', userNickname: '탈퇴회원', reason: '허위 정보 유포', banType: 'TEMPORARY', startDate: '2023-12-01', endDate: '2023-12-08', isActive: false },
  { banId: 4, userUuid: 'uuid-011', userNickname: '어뷰저', reason: '매크로 도배', banType: 'WARNING', startDate: '2024-01-12', endDate: '2024-01-13', isActive: false },
];

const BAN_TYPE_LABELS: Record<string, string> = { TEMPORARY: '임시 정지', PERMANENT: '영구 정지', WARNING: '경고' };

export default function BansPage() {
  const [bans, setBans] = useState<MockBan[]>(INITIAL_BANS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ userUuid: '', userNickname: '', reason: '', banType: 'TEMPORARY', duration: '' });

  const filtered = bans.filter((ban) => {
    const matchSearch = !search || ban.userNickname.toLowerCase().includes(search.toLowerCase()) || ban.userUuid.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || (statusFilter === 'active' && ban.isActive) || (statusFilter === 'expired' && !ban.isActive);
    return matchSearch && matchStatus;
  });

  const handleCreate = () => {
    const newBan: MockBan = {
      banId: Date.now(),
      userUuid: form.userUuid,
      userNickname: form.userNickname || form.userUuid,
      reason: form.reason,
      banType: form.banType,
      startDate: new Date().toISOString().split('T')[0],
      endDate: form.banType === 'TEMPORARY' && form.duration
        ? new Date(Date.now() + Number(form.duration) * 86400000).toISOString().split('T')[0]
        : null,
      isActive: true,
    };
    setBans((prev) => [newBan, ...prev]);
    toast.success('제재를 등록했습니다.');
    setCreateOpen(false);
    setForm({ userUuid: '', userNickname: '', reason: '', banType: 'TEMPORARY', duration: '' });
  };

  const handleRelease = (banId: number) => {
    setBans((prev) => prev.map((b) => b.banId === banId ? { ...b, isActive: false } : b));
    toast.success('제재를 해제했습니다.');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">제재 관리</h1>
          <p className="text-sm text-muted-foreground mt-0.5">사용자 제재 내역을 관리합니다.</p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <ShieldPlus className="mr-2 h-4 w-4" />제재 등록
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="닉네임 또는 UUID 검색..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8" />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter((v ?? 'all') as typeof statusFilter)}>
              <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="expired">만료</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사용자</TableHead>
                <TableHead>제재 유형</TableHead>
                <TableHead>사유</TableHead>
                <TableHead>시작일</TableHead>
                <TableHead>종료일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((ban) => (
                <TableRow key={ban.banId}>
                  <TableCell>
                    <div className="font-medium text-sm">{ban.userNickname}</div>
                    <div className="text-xs text-muted-foreground">{ban.userUuid}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ban.banType === 'PERMANENT' ? 'destructive' : 'secondary'}>
                      {BAN_TYPE_LABELS[ban.banType]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm max-w-[180px] truncate">{ban.reason}</TableCell>
                  <TableCell className="text-sm">{ban.startDate}</TableCell>
                  <TableCell className="text-sm">{ban.endDate ?? '영구'}</TableCell>
                  <TableCell>
                    <Badge variant={ban.isActive ? 'default' : 'outline'}>{ban.isActive ? '활성' : '만료'}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {ban.isActive && (
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleRelease(ban.banId)}>
                        해제
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">제재 내역이 없습니다.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>제재 등록</DialogTitle>
            <DialogDescription>사용자에게 제재를 부여합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>사용자 닉네임</Label>
              <Input value={form.userNickname} onChange={(e) => setForm((f) => ({ ...f, userNickname: e.target.value }))} placeholder="닉네임" />
            </div>
            <div className="space-y-1.5">
              <Label>제재 유형</Label>
              <Select value={form.banType} onValueChange={(v) => setForm((f) => ({ ...f, banType: v ?? 'TEMPORARY' }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="WARNING">경고</SelectItem>
                  <SelectItem value="TEMPORARY">임시 정지</SelectItem>
                  <SelectItem value="PERMANENT">영구 정지</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.banType === 'TEMPORARY' && (
              <div className="space-y-1.5">
                <Label>기간 (일)</Label>
                <Input type="number" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="정지 기간" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>사유</Label>
              <Textarea value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} placeholder="제재 사유를 입력하세요." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>취소</Button>
            <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleCreate} disabled={!form.userNickname || !form.reason}>
              제재 등록
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
