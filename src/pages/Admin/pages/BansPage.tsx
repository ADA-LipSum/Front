import { useEffect, useState } from 'react';
import { ShieldPlus, Search, ChevronUp, ChevronDown, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import { getBans, createBan, releaseBanById, getBanStats, type Ban, type BanStat } from '@/api/admin';
import { cn } from '@/lib/utils';

const BAN_TYPE_LABELS: Record<string, string> = { TEMPORARY: '임시 정지', PERMANENT: '영구 정지', WARNING: '경고' };

type SortDir = 'asc' | 'desc';
type SortConfig = { field: keyof Ban; dir: SortDir } | null;

function SortHead({
  label, field, sort, onSort,
}: {
  label: string; field: keyof Ban; sort: SortConfig; onSort: (f: keyof Ban) => void;
}) {
  const active = sort?.field === field;
  const Icon = active ? (sort!.dir === 'asc' ? ChevronUp : ChevronDown) : ChevronsUpDown;
  return (
    <TableHead className="cursor-pointer select-none" onClick={() => onSort(field)}>
      <div className="flex items-center gap-1">
        {label}
        <Icon className={cn('h-3 w-3 shrink-0', !active && 'opacity-40')} />
      </div>
    </TableHead>
  );
}

export default function BansPage() {
  const [bans, setBans] = useState<Ban[]>([]);
  const [stats, setStats] = useState<BanStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sort, setSort] = useState<SortConfig>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [releaseTarget, setReleaseTarget] = useState<Ban | null>(null);
  const [releasing, setReleasing] = useState(false);
  const [form, setForm] = useState({ userUuid: '', reason: '', banType: 'TEMPORARY', duration: '' });

  const loadData = () => {
    setLoading(true);
    Promise.all([getBans(), getBanStats()])
      .then(([bansData, statsData]) => { setBans(bansData); setStats(statsData); })
      .catch(() => toast.error('제재 목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleSort = (field: keyof Ban) =>
    setSort((prev) =>
      prev?.field === field ? (prev.dir === 'asc' ? { field, dir: 'desc' } : null) : { field, dir: 'asc' },
    );

  const filtered = bans.filter((ban) => {
    const matchSearch = !search
      || ban.userNickname.toLowerCase().includes(search.toLowerCase())
      || ban.userUuid.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || (statusFilter === 'active' && ban.isActive) || (statusFilter === 'expired' && !ban.isActive);
    const matchType = typeFilter === 'all' || ban.banType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const sorted = sort
    ? [...filtered].sort((a, b) => {
        const va = a[sort.field];
        const vb = b[sort.field];
        const cmp = typeof va === 'number' && typeof vb === 'number'
          ? va - vb
          : String(va ?? '').localeCompare(String(vb ?? ''), 'ko');
        return sort.dir === 'asc' ? cmp : -cmp;
      })
    : filtered;

  const handleCreate = async () => {
    if (!form.userUuid || !form.reason) return;
    setCreating(true);
    try {
      await createBan({
        userUuid: form.userUuid.trim(),
        reason: form.reason,
        banType: form.banType,
        ...(form.banType === 'TEMPORARY' && form.duration ? { duration: Number(form.duration) } : {}),
      });
      toast.success('제재를 등록했습니다.');
      setCreateOpen(false);
      setForm({ userUuid: '', reason: '', banType: 'TEMPORARY', duration: '' });
      loadData();
    } catch {
      toast.error('제재 등록에 실패했습니다.');
    } finally {
      setCreating(false);
    }
  };

  const handleRelease = async () => {
    if (!releaseTarget) return;
    setReleasing(true);
    try {
      await releaseBanById(releaseTarget.banId);
      toast.success('제재를 해제했습니다.');
      setReleaseTarget(null);
      loadData();
    } catch {
      toast.error('제재 해제에 실패했습니다.');
    } finally {
      setReleasing(false);
    }
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

      {stats.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {stats.map((s) => (
            <Card key={s.banType} className="flex-1 min-w-[140px]">
              <CardContent className="pt-4 pb-3">
                <div className="text-xs text-muted-foreground">{BAN_TYPE_LABELS[s.banType] ?? s.banType}</div>
                <div className="text-2xl font-bold">{s.activeCount}</div>
                <div className="text-xs text-muted-foreground">활성 / 전체 {s.count}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="닉네임 또는 UUID 검색..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8" />
            </div>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? 'all')}>
              <SelectTrigger className="w-32 h-8"><SelectValue placeholder="제재 유형" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 유형</SelectItem>
                <SelectItem value="WARNING">경고</SelectItem>
                <SelectItem value="TEMPORARY">임시 정지</SelectItem>
                <SelectItem value="PERMANENT">영구 정지</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter((v ?? 'all') as typeof statusFilter)}>
              <SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
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
                <SortHead label="사용자" field="userNickname" sort={sort} onSort={handleSort} />
                <SortHead label="제재 유형" field="banType" sort={sort} onSort={handleSort} />
                <SortHead label="사유" field="reason" sort={sort} onSort={handleSort} />
                <SortHead label="시작일" field="startDate" sort={sort} onSort={handleSort} />
                <SortHead label="종료일" field="endDate" sort={sort} onSort={handleSort} />
                <SortHead label="상태" field="isActive" sort={sort} onSort={handleSort} />
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : sorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">제재 내역이 없습니다.</TableCell>
                </TableRow>
              ) : (
                sorted.map((ban) => (
                  <TableRow key={ban.banId}>
                    <TableCell>
                      <div className="font-medium text-sm">{ban.userNickname}</div>
                      <div className="text-xs text-muted-foreground font-mono">{ban.userUuid}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ban.banType === 'PERMANENT' ? 'destructive' : 'secondary'}>
                        {BAN_TYPE_LABELS[ban.banType] ?? ban.banType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm max-w-[180px] truncate">{ban.reason}</TableCell>
                    <TableCell className="text-sm">{new Date(ban.startDate).toLocaleDateString('ko-KR')}</TableCell>
                    <TableCell className="text-sm">{ban.endDate ? new Date(ban.endDate).toLocaleDateString('ko-KR') : '영구'}</TableCell>
                    <TableCell>
                      <Badge variant={ban.isActive ? 'default' : 'outline'}>{ban.isActive ? '활성' : '만료'}</Badge>
                    </TableCell>
                    <TableCell>
                      {ban.isActive && (
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setReleaseTarget(ban)}>
                          해제
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={(open) => { if (!open) setCreateOpen(false); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>제재 등록</DialogTitle>
            <DialogDescription>사용자에게 제재를 부여합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>사용자 UUID</Label>
              <Input value={form.userUuid} onChange={(e) => setForm((f) => ({ ...f, userUuid: e.target.value }))} placeholder="사용자 UUID" />
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
                <Input type="number" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="정지 기간" min={1} />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>사유</Label>
              <Textarea value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} placeholder="제재 사유를 입력하세요." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>취소</Button>
            <Button
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleCreate}
              disabled={!form.userUuid.trim() || !form.reason || creating}
            >
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}제재 등록
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!releaseTarget} onOpenChange={() => setReleaseTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>'{releaseTarget?.userNickname}' 제재를 해제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>제재가 즉시 해제되며 사용자는 서비스를 이용할 수 있게 됩니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleRelease} disabled={releasing}>
              {releasing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}해제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
