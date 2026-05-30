import { useEffect, useRef, useState } from 'react';
import { Search, UserMinus, Loader2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import { getAdminGroups, getGroupsByCategory, dissolveGroup, removeGroupMember, type StudyGroup, type PagedResponse } from '@/api/admin';
import { cn } from '@/lib/utils';

const VISIBILITY_LABELS: Record<string, string> = { PUBLIC: '공개', PRIVATE: '비공개' };
const STATUS_LABELS: Record<string, string> = { OPEN: '활성', CLOSED: '해산' };

type SortDir = 'asc' | 'desc';
type SortConfig = { field: keyof StudyGroup; dir: SortDir } | null;

function SortHead({
  label, field, sort, onSort, right,
}: {
  label: string; field: keyof StudyGroup; sort: SortConfig; onSort: (f: keyof StudyGroup) => void; right?: boolean;
}) {
  const active = sort?.field === field;
  const Icon = active ? (sort!.dir === 'asc' ? ChevronUp : ChevronDown) : ChevronsUpDown;
  return (
    <TableHead className={cn('cursor-pointer select-none', right && 'text-right')} onClick={() => onSort(field)}>
      <div className={cn('flex items-center gap-1', right && 'justify-end')}>
        {label}
        <Icon className={cn('h-3 w-3 shrink-0', !active && 'opacity-40')} />
      </div>
    </TableHead>
  );
}

export default function GroupsPage() {
  const [data, setData] = useState<PagedResponse<StudyGroup> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [category, setCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState<SortConfig>(null);
  const [dissolveTarget, setDissolveTarget] = useState<StudyGroup | null>(null);
  const [dissolving, setDissolving] = useState(false);
  const [memberRemoveTarget, setMemberRemoveTarget] = useState<StudyGroup | null>(null);
  const [memberUuid, setMemberUuid] = useState('');
  const [removing, setRemoving] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchGroups = (p: number, cat: string) => {
    setLoading(true);
    const req = cat
      ? getGroupsByCategory(cat, { page: p, size: 20 })
      : getAdminGroups({ page: p, size: 20 });
    req
      .then(setData)
      .catch(() => toast.error('그룹 목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchGroups(page, category); }, [page, category]);

  const handleCategoryChange = (value: string) => {
    setCategoryInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setPage(0); setCategory(value.trim()); }, 400);
  };

  const handleSort = (field: keyof StudyGroup) =>
    setSort((prev) =>
      prev?.field === field ? (prev.dir === 'asc' ? { field, dir: 'desc' } : null) : { field, dir: 'asc' },
    );

  const handleRemoveMember = async () => {
    if (!memberRemoveTarget || !memberUuid.trim()) return;
    setRemoving(true);
    try {
      await removeGroupMember(memberRemoveTarget.groupUuid, memberUuid.trim());
      toast.success('멤버를 강제 탈퇴시켰습니다.');
      setMemberRemoveTarget(null);
      setMemberUuid('');
      fetchGroups(page, category);
    } catch {
      toast.error('멤버 탈퇴에 실패했습니다.');
    } finally {
      setRemoving(false);
    }
  };

  const handleDissolve = async () => {
    if (!dissolveTarget) return;
    setDissolving(true);
    try {
      await dissolveGroup(dissolveTarget.groupUuid);
      toast.success('그룹을 강제 해산했습니다.');
      setDissolveTarget(null);
      fetchGroups(page, category);
    } catch {
      toast.error('해산에 실패했습니다.');
    } finally {
      setDissolving(false);
    }
  };

  const rawGroups = data?.content ?? [];

  const filtered = rawGroups.filter((g) => {
    const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || g.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const groups = sort
    ? [...filtered].sort((a, b) => {
        const va = a[sort.field];
        const vb = b[sort.field];
        const cmp = typeof va === 'number' && typeof vb === 'number'
          ? va - vb
          : String(va ?? '').localeCompare(String(vb ?? ''), 'ko');
        return sort.dir === 'asc' ? cmp : -cmp;
      })
    : filtered;

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">스터디 그룹 관리</h1>
        <p className="text-sm text-muted-foreground mt-0.5">전체 스터디 그룹 현황을 관리합니다.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative min-w-[180px] max-w-xs">
                <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="그룹명 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8"
                />
              </div>
              <div className="relative min-w-[160px] max-w-xs">
                <Input
                  placeholder="카테고리 검색..."
                  value={categoryInput}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="h-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
                <SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="OPEN">활성</SelectItem>
                  <SelectItem value="CLOSED">해산</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {data && (
              <span className="text-xs text-muted-foreground">전체 {data.totalElements.toLocaleString()}개</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <SortHead label="그룹명" field="name" sort={sort} onSort={handleSort} />
                <SortHead label="카테고리" field="category" sort={sort} onSort={handleSort} />
                <SortHead label="공개" field="visibility" sort={sort} onSort={handleSort} />
                <SortHead label="정원" field="capacity" sort={sort} onSort={handleSort} right />
                <SortHead label="멤버" field="memberCount" sort={sort} onSort={handleSort} right />
                <SortHead label="상태" field="status" sort={sort} onSort={handleSort} />
                <SortHead label="생성일" field="createdAt" sort={sort} onSort={handleSort} />
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : groups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    그룹이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                groups.map((group) => (
                  <TableRow key={group.groupUuid}>
                    <TableCell className="font-medium text-sm max-w-[160px] truncate">{group.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{group.category}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {VISIBILITY_LABELS[group.visibility] ?? group.visibility}
                    </TableCell>
                    <TableCell className="text-right text-sm">{group.capacity}</TableCell>
                    <TableCell className="text-right text-sm">{group.memberCount}</TableCell>
                    <TableCell>
                      <Badge variant={group.status === 'OPEN' ? 'default' : 'secondary'}>
                        {STATUS_LABELS[group.status] ?? group.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(group.createdAt).toLocaleDateString('ko-KR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost" size="sm"
                          className="h-7 text-xs"
                          onClick={() => { setMemberRemoveTarget(group); setMemberUuid(''); }}
                        >
                          멤버 탈퇴
                        </Button>
                        {group.status === 'OPEN' && (
                          <Button
                            variant="outline" size="sm"
                            className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setDissolveTarget(group)}
                          >
                            <UserMinus className="mr-1 h-3 w-3" />강제 해산
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">{page + 1} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog open={!!memberRemoveTarget} onOpenChange={(open) => { if (!open) { setMemberRemoveTarget(null); setMemberUuid(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>멤버 강제 탈퇴</DialogTitle>
            <DialogDescription>'{memberRemoveTarget?.name}' 그룹에서 멤버를 강제 탈퇴시킵니다. 리더는 탈퇴시킬 수 없습니다.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-1.5">
            <Label>탈퇴시킬 멤버 UUID</Label>
            <Input
              value={memberUuid}
              onChange={(e) => setMemberUuid(e.target.value)}
              placeholder="사용자 UUID"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setMemberRemoveTarget(null); setMemberUuid(''); }}>취소</Button>
            <Button disabled={!memberUuid.trim() || removing} onClick={handleRemoveMember}>
              {removing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}강제 탈퇴
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!dissolveTarget} onOpenChange={() => setDissolveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>'{dissolveTarget?.name}' 그룹을 강제 해산하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>그룹의 모든 멤버가 퇴출되며 이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDissolve}
              disabled={dissolving}
            >
              {dissolving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}강제 해산
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

