import { useEffect, useState, useRef } from 'react';
import { Search, Trash2, Loader2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ChevronsUpDown, RefreshCw, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'react-toastify';
import { getAdminPosts, deleteUserPosts, deleteComment, resequenceTable, type AdminPost, type PagedResponse } from '@/api/admin';
import { cn } from '@/lib/utils';

const BOARD_LABELS: Record<string, string> = {
  COMMUNITY: '커뮤니티',
  QNA: 'Q&A',
  NOTICE: '공지',
};

const CATEGORY_LABELS: Record<string, string> = {
  CHAT: '자유',
  QNA: 'Q&A',
  TECH: '기술',
  STUDY: '스터디',
};

type SortDir = 'asc' | 'desc';
type SortConfig = { field: keyof AdminPost; dir: SortDir } | null;

function SortHead({
  label, field, sort, onSort, right,
}: {
  label: string; field: keyof AdminPost; sort: SortConfig; onSort: (f: keyof AdminPost) => void; right?: boolean;
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

export default function PostsPage() {
  const [selectedPost, setSelectedPost] = useState<AdminPost | null>(null);

  const [data, setData] = useState<PagedResponse<AdminPost> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [boardFilter, setBoardFilter] = useState('all');
  const [sort, setSort] = useState<SortConfig>(null);
  const [bulkDeleteTarget, setBulkDeleteTarget] = useState<{ uuid: string; writer: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [commentIdInput, setCommentIdInput] = useState('');
  const [deleteCommentConfirm, setDeleteCommentConfirm] = useState(false);
  const [deletingComment, setDeletingComment] = useState(false);

  const [reseqTable, setReseqTable] = useState('posts');
  const [reseqConfirm, setReseqConfirm] = useState(false);
  const [resequencing, setResequencing] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPosts = (p: number, q: string) => {
    setLoading(true);
    getAdminPosts({ page: p, size: 20, q: q || undefined })
      .then(setData)
      .catch(() => toast.error('게시글 목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(page, search); }, [page, search]);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setPage(0); setSearch(value); }, 400);
  };

  const handleSort = (field: keyof AdminPost) =>
    setSort((prev) =>
      prev?.field === field ? (prev.dir === 'asc' ? { field, dir: 'desc' } : null) : { field, dir: 'asc' },
    );

  const handleBulkDelete = async () => {
    if (!bulkDeleteTarget) return;
    setDeleting(true);
    try {
      await deleteUserPosts(bulkDeleteTarget.uuid);
      toast.success('해당 사용자의 게시글을 모두 삭제했습니다.');
      setBulkDeleteTarget(null);
      fetchPosts(page, search);
    } catch {
      toast.error('삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteComment = async () => {
    const id = Number(commentIdInput);
    if (!id) return;
    setDeletingComment(true);
    try {
      await deleteComment(id);
      toast.success(`댓글 #${id}을 삭제했습니다.`);
      setCommentIdInput('');
      setDeleteCommentConfirm(false);
    } catch {
      toast.error('댓글 삭제에 실패했습니다.');
    } finally {
      setDeletingComment(false);
    }
  };

  const handleResequence = async () => {
    setResequencing(true);
    try {
      await resequenceTable(reseqTable);
      toast.success(`${reseqTable} 테이블 재정렬을 시작했습니다.`);
      setReseqConfirm(false);
    } catch {
      toast.error('재정렬 요청에 실패했습니다.');
    } finally {
      setResequencing(false);
    }
  };

  const rawPosts = data?.content ?? [];
  const filtered = boardFilter === 'all' ? rawPosts : rawPosts.filter((p) => p.boardType === boardFilter);
  const posts = sort
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

  // ── 댓글 뷰 ──────────────────────────────────────────────────────────────────
  if (selectedPost) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setSelectedPost(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              댓글<span className="text-muted-foreground font-normal text-lg ml-1">[{selectedPost.title}]</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {selectedPost.writer} · {new Date(selectedPost.writedAt).toLocaleDateString('ko-KR')} · 댓글 {selectedPost.comments.toLocaleString()}개
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>내용</TableHead>
                  <TableHead>작성자</TableHead>
                  <TableHead>작성일</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                    API 연동 후 댓글이 표시됩니다.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 관리 도구 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">관리 도구</CardTitle>
            <CardDescription>댓글 강제 삭제 및 AUTO_INCREMENT 재정렬</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">댓글 강제 삭제</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="댓글 ID"
                  value={commentIdInput}
                  onChange={(e) => setCommentIdInput(e.target.value)}
                  className="w-36 h-8"
                  min={1}
                />
                <Button
                  variant="ghost" size="sm"
                  className="h-8 text-xs text-destructive hover:text-destructive"
                  disabled={!commentIdInput}
                  onClick={() => setDeleteCommentConfirm(true)}
                >
                  <Trash2 className="mr-1 h-3 w-3" />삭제
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">AUTO_INCREMENT 재정렬</Label>
              <div className="flex items-center gap-2">
                <Select value={reseqTable} onValueChange={(value) => value !== null && setReseqTable(value)}>
                  <SelectTrigger className="w-40 h-8"><SelectValue>{{ posts: '게시글 (posts)', comments: '댓글 (comments)' }[reseqTable] ?? reseqTable}</SelectValue></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="posts">게시글 (posts)</SelectItem>
                    <SelectItem value="comments">댓글 (comments)</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setReseqConfirm(true)}>
                  <RefreshCw className="mr-1 h-3 w-3" />재정렬 실행
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 댓글 삭제 confirm */}
        <AlertDialog open={deleteCommentConfirm} onOpenChange={setDeleteCommentConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>댓글 #{commentIdInput}을 삭제하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>해당 댓글의 좋아요 및 자식 댓글도 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={handleDeleteComment}
                disabled={deletingComment}
              >
                {deletingComment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* 재정렬 confirm */}
        <AlertDialog open={reseqConfirm} onOpenChange={setReseqConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>'{reseqTable}' 테이블을 재정렬하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>AUTO_INCREMENT 값을 현재 데이터 기준으로 재정렬합니다. 서비스 중 실행 시 주의하세요.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleResequence} disabled={resequencing}>
                {resequencing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}실행
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // ── 게시글 목록 뷰 ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">게시글 / 댓글 관리</h1>
        <p className="text-sm text-muted-foreground mt-0.5">전체 게시글을 조회하고 관리합니다.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative min-w-[200px] max-w-sm">
                <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="제목 검색..."
                  value={inputValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-8 h-8"
                />
              </div>
              <Select value={boardFilter} onValueChange={(v) => setBoardFilter(v ?? 'all')}>
                <SelectTrigger className="w-32 h-8"><SelectValue>{{ all: '전체 게시판', ...BOARD_LABELS }[boardFilter] ?? boardFilter}</SelectValue></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 게시판</SelectItem>
                  <SelectItem value="COMMUNITY">커뮤니티</SelectItem>
                  <SelectItem value="QNA">Q&A</SelectItem>
                  <SelectItem value="NOTICE">공지</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {data && (
              <span className="text-xs text-muted-foreground">전체 {data.totalElements.toLocaleString()}건</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <SortHead label="제목" field="title" sort={sort} onSort={handleSort} />
                <SortHead label="작성자" field="writer" sort={sort} onSort={handleSort} />
                <SortHead label="게시판" field="boardType" sort={sort} onSort={handleSort} />
                <SortHead label="조회" field="views" sort={sort} onSort={handleSort} right />
                <SortHead label="좋아요" field="likes" sort={sort} onSort={handleSort} right />
                <SortHead label="댓글" field="comments" sort={sort} onSort={handleSort} right />
                <SortHead label="작성일" field="writedAt" sort={sort} onSort={handleSort} />
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
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    게시글이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow
                    key={post.postUuid}
                    className="cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    <TableCell className="font-medium text-sm max-w-[200px] truncate">{post.title}</TableCell>
                    <TableCell className="text-sm">{post.writer}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {BOARD_LABELS[post.boardType] ?? post.boardType}
                        {post.communityCategory ? ` · ${CATEGORY_LABELS[post.communityCategory] ?? post.communityCategory}` : ''}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm">{post.views.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-sm">{post.likes.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-sm">{post.comments.toLocaleString()}</TableCell>
                    <TableCell className="text-sm">{new Date(post.writedAt).toLocaleDateString('ko-KR')}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost" size="sm"
                        className="h-7 text-xs text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBulkDeleteTarget({ uuid: post.writerUuid, writer: post.writer });
                        }}
                      >
                        <Trash2 className="mr-1 h-3 w-3" />작성자 일괄 삭제
                      </Button>
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

      {/* 작성자 일괄 삭제 confirm */}
      <AlertDialog open={!!bulkDeleteTarget} onOpenChange={() => setBulkDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>'{bulkDeleteTarget?.writer}'의 게시글을 모두 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>이 작업은 되돌릴 수 없습니다. 해당 사용자가 작성한 모든 게시글이 삭제됩니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleBulkDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}전체 삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
