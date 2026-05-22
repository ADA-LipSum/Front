import { useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'react-toastify';

interface MockPost {
  postId: number;
  title: string;
  authorUuid: string;
  authorNickname: string;
  category: string;
  createdAt: string;
  viewCount: number;
  commentCount: number;
}

const INITIAL_POSTS: MockPost[] = [
  { postId: 1, title: 'React 19 새로운 기능 정리', authorUuid: 'uuid-003', authorNickname: '홍길동', category: 'QnA', createdAt: '2024-01-15', viewCount: 342, commentCount: 12 },
  { postId: 2, title: 'TypeScript 5.0 마이그레이션 가이드', authorUuid: 'uuid-004', authorNickname: '이순신', category: '기술', createdAt: '2024-01-14', viewCount: 521, commentCount: 8 },
  { postId: 3, title: '알고리즘 스터디 같이 할 분 구해요', authorUuid: 'uuid-006', authorNickname: '세종대왕', category: '자유', createdAt: '2024-01-13', viewCount: 89, commentCount: 23 },
  { postId: 4, title: 'Next.js App Router vs Pages Router 비교', authorUuid: 'uuid-003', authorNickname: '홍길동', category: '기술', createdAt: '2024-01-12', viewCount: 678, commentCount: 31 },
  { postId: 5, title: 'Java Spring Boot 질문 있습니다', authorUuid: 'uuid-004', authorNickname: '이순신', category: 'QnA', createdAt: '2024-01-11', viewCount: 156, commentCount: 5 },
  { postId: 6, title: 'Python 비동기 처리 개념 정리', authorUuid: 'uuid-006', authorNickname: '세종대왕', category: '기술', createdAt: '2024-01-10', viewCount: 234, commentCount: 9 },
];

export default function PostsPage() {
  const [posts, setPosts] = useState<MockPost[]>(INITIAL_POSTS);
  const [search, setSearch] = useState('');
  const [bulkDeleteTarget, setBulkDeleteTarget] = useState<{ uuid: string; nickname: string } | null>(null);

  const filtered = posts.filter(
    (p) => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.authorNickname.toLowerCase().includes(search.toLowerCase()),
  );

  const handleBulkDelete = (authorUuid: string) => {
    setPosts((prev) => prev.filter((p) => p.authorUuid !== authorUuid));
    toast.success('해당 사용자의 게시글을 모두 삭제했습니다.');
    setBulkDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">게시글 / 댓글 관리</h1>
        <p className="text-sm text-muted-foreground mt-0.5">전체 게시글을 조회하고 관리합니다.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="제목 또는 작성자 검색..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead>작성자</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead className="text-right">조회</TableHead>
                <TableHead className="text-right">댓글</TableHead>
                <TableHead>작성일</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((post) => (
                <TableRow key={post.postId}>
                  <TableCell className="font-medium text-sm max-w-[220px] truncate">{post.title}</TableCell>
                  <TableCell className="text-sm">{post.authorNickname}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{post.category}</Badge></TableCell>
                  <TableCell className="text-right text-sm">{post.viewCount.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-sm">{post.commentCount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{post.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive"
                      onClick={() => setBulkDeleteTarget({ uuid: post.authorUuid, nickname: post.authorNickname })}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />작성자 일괄 삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">게시글이 없습니다.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!bulkDeleteTarget} onOpenChange={() => setBulkDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>'{bulkDeleteTarget?.nickname}'의 게시글을 모두 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>이 작업은 되돌릴 수 없습니다. 해당 사용자가 작성한 모든 게시글이 삭제됩니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => bulkDeleteTarget && handleBulkDelete(bulkDeleteTarget.uuid)}>
              전체 삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
