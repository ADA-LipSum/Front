import { useState } from 'react';
import { Search, UserMinus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'react-toastify';

interface MockGroup {
  groupId: number;
  name: string;
  categoryName: string;
  leaderNickname: string;
  memberCount: number;
  isActive: boolean;
  createdAt: string;
}

const INITIAL_GROUPS: MockGroup[] = [
  { groupId: 1, name: '알고리즘 마스터즈', categoryName: '알고리즘', leaderNickname: '홍길동', memberCount: 8, isActive: true, createdAt: '2024-01-01' },
  { groupId: 2, name: '리액트 스터디', categoryName: '프론트엔드', leaderNickname: '이순신', memberCount: 12, isActive: true, createdAt: '2024-01-05' },
  { groupId: 3, name: '백엔드 심화반', categoryName: '백엔드', leaderNickname: '세종대왕', memberCount: 6, isActive: true, createdAt: '2024-01-08' },
  { groupId: 4, name: 'CS 기초 스터디', categoryName: 'CS 기초', leaderNickname: '강감찬', memberCount: 15, isActive: false, createdAt: '2023-12-01' },
  { groupId: 5, name: '코딩 테스트 준비', categoryName: '알고리즘', leaderNickname: '김선생', memberCount: 20, isActive: true, createdAt: '2024-01-10' },
];

export default function GroupsPage() {
  const [groups, setGroups] = useState<MockGroup[]>(INITIAL_GROUPS);
  const [search, setSearch] = useState('');
  const [dissolveId, setDissolveId] = useState<number | null>(null);
  const dissolveTarget = groups.find((g) => g.groupId === dissolveId);

  const filtered = groups.filter(
    (g) => !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.leaderNickname.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDissolve = (groupId: number) => {
    setGroups((prev) => prev.map((g) => g.groupId === groupId ? { ...g, isActive: false, memberCount: 0 } : g));
    toast.success('그룹을 강제 해산했습니다.');
    setDissolveId(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">스터디 그룹 관리</h1>
        <p className="text-sm text-muted-foreground mt-0.5">전체 스터디 그룹 현황을 관리합니다.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="그룹명 또는 리더 검색..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>그룹명</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>리더</TableHead>
                <TableHead className="text-right">멤버 수</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>생성일</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((group) => (
                <TableRow key={group.groupId}>
                  <TableCell className="font-medium text-sm">{group.name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{group.categoryName}</Badge></TableCell>
                  <TableCell className="text-sm">{group.leaderNickname}</TableCell>
                  <TableCell className="text-right text-sm">{group.memberCount}</TableCell>
                  <TableCell><Badge variant={group.isActive ? 'default' : 'secondary'}>{group.isActive ? '활성' : '해산'}</Badge></TableCell>
                  <TableCell className="text-sm">{group.createdAt}</TableCell>
                  <TableCell className="text-right">
                    {group.isActive && (
                      <Button variant="outline" size="sm" className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive" onClick={() => setDissolveId(group.groupId)}>
                        <UserMinus className="mr-1 h-3 w-3" />강제 해산
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">그룹이 없습니다.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!dissolveId} onOpenChange={() => setDissolveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>'{dissolveTarget?.name}' 그룹을 강제 해산하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>그룹의 모든 멤버가 퇴출되며 이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => dissolveId && handleDissolve(dissolveId)}>강제 해산</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
