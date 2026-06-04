import { useEffect, useState } from 'react';
import { Plus, Loader2, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'react-toastify';
import { getAllBanners, createBanner, updateBanner, deleteBanner, type Banner } from '@/api/admin';

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createFile, setCreateFile] = useState<File | null>(null);
  const [createTargetUrl, setCreateTargetUrl] = useState('');

  const [editTarget, setEditTarget] = useState<Banner | null>(null);
  const [editTargetUrl, setEditTargetUrl] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [editing, setEditing] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadBanners = () => {
    setLoading(true);
    getAllBanners()
      .then(setBanners)
      .catch(() => toast.error('배너 목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadBanners(); }, []);

  const handleCreate = async () => {
    if (!createFile) return;
    setCreating(true);
    try {
      const fd = new FormData();
      fd.append('file', createFile);
      if (createTargetUrl) fd.append('targetUrl', createTargetUrl);
      await createBanner(fd);
      toast.success('배너를 등록했습니다.');
      setCreateOpen(false);
      setCreateFile(null);
      setCreateTargetUrl('');
      loadBanners();
    } catch {
      toast.error('배너 등록에 실패했습니다.');
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    setEditing(true);
    try {
      await updateBanner(editTarget.bannerId, {
        targetUrl: editTargetUrl || null,
        isActive: editActive,
      });
      toast.success('배너를 수정했습니다.');
      setEditTarget(null);
      loadBanners();
    } catch {
      toast.error('배너 수정에 실패했습니다.');
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBanner(deleteTarget.bannerId);
      toast.success('배너를 삭제했습니다.');
      setDeleteTarget(null);
      loadBanners();
    } catch {
      toast.error('배너 삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">배너 관리</h1>
          <p className="text-sm text-muted-foreground mt-0.5">커뮤니티 배너를 등록하고 관리합니다.</p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />배너 등록
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>미리보기</TableHead>
                <TableHead>링크</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>등록일</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : banners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">등록된 배너가 없습니다.</TableCell>
                </TableRow>
              ) : (
                banners.map((banner) => (
                  <TableRow key={banner.bannerId}>
                    <TableCell>
                      <img
                        src={banner.imageUrl}
                        alt={`배너 #${banner.bannerId}`}
                        className="h-12 w-24 object-cover rounded-md border"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </TableCell>
                    <TableCell className="text-sm">
                      {banner.targetUrl ? (
                        <a
                          href={banner.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline max-w-[200px] truncate"
                        >
                          {banner.targetUrl}
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={banner.isActive ? 'default' : 'outline'}>
                        {banner.isActive ? '활성' : '비활성'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{new Date(banner.createdAt).toLocaleDateString('ko-KR')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost" size="sm" className="h-7 text-xs"
                          onClick={() => {
                            setEditTarget(banner);
                            setEditTargetUrl(banner.targetUrl ?? '');
                            setEditActive(banner.isActive);
                          }}
                        >
                          <Pencil className="mr-1 h-3 w-3" />수정
                        </Button>
                        <Button
                          variant="ghost" size="sm"
                          className="h-7 text-xs text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(banner)}
                        >
                          <Trash2 className="mr-1 h-3 w-3" />삭제
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 배너 등록 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>배너 등록</DialogTitle>
            <DialogDescription>커뮤니티에 표시할 배너를 등록합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>배너 이미지</Label>
              <Input type="file" accept="image/*" onChange={(e) => setCreateFile(e.target.files?.[0] ?? null)} />
            </div>
            <div className="space-y-1.5">
              <Label>링크 URL (선택)</Label>
              <Input
                value={createTargetUrl}
                onChange={(e) => setCreateTargetUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>취소</Button>
            <Button onClick={handleCreate} disabled={!createFile || creating}>
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}등록
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 배너 수정 */}
      <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>배너 수정</DialogTitle>
            <DialogDescription>배너 #${editTarget?.bannerId} 정보를 수정합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>링크 URL</Label>
              <Input
                value={editTargetUrl}
                onChange={(e) => setEditTargetUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>활성 상태</Label>
              <Select value={editActive ? 'active' : 'inactive'} onValueChange={(v) => setEditActive(v === 'active')}>
                <SelectTrigger><SelectValue>{editActive ? '활성' : '비활성'}</SelectValue></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>취소</Button>
            <Button onClick={handleEdit} disabled={editing}>
              {editing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 배너 삭제 */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>배너 #{deleteTarget?.bannerId}를 삭제하시겠습니까?</AlertDialogTitle>
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
