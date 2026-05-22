import { useState } from 'react';
import { PenLine, Trash2, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'react-toastify';

interface MockNotice {
  id: number;
  title: string;
  content: string;
  authorNickname: string;
  createdAt: string;
  updatedAt: string;
}

const INITIAL_NOTICES: MockNotice[] = [
  { id: 1, title: '서비스 점검 안내', content: '2024년 1월 15일 오전 2시부터 4시까지 서비스 점검이 있을 예정입니다.', authorNickname: '관리자', createdAt: '2024-01-10', updatedAt: '2024-01-10' },
  { id: 2, title: '코인 이벤트 안내', content: '신규 가입 시 100 코인을 지급합니다.', authorNickname: '관리자', createdAt: '2024-01-08', updatedAt: '2024-01-08' },
  { id: 3, title: '스터디 그룹 기능 업데이트', content: '스터디 그룹에 새로운 기능이 추가되었습니다.', authorNickname: '관리자', createdAt: '2024-01-05', updatedAt: '2024-01-06' },
];

export default function NoticesPage() {
  const [notices, setNotices] = useState<MockNotice[]>(INITIAL_NOTICES);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<MockNotice | null>(null);
  const [form, setForm] = useState({ title: '', content: '' });

  const handleEdit = (notice: MockNotice) => {
    setEditTarget(notice);
    setForm({ title: notice.title, content: notice.content });
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditTarget(null);
    setForm({ title: '', content: '' });
  };

  const handleSubmit = () => {
    if (editTarget) {
      setNotices((prev) => prev.map((n) => n.id === editTarget.id ? { ...n, ...form, updatedAt: new Date().toISOString().split('T')[0] } : n));
      toast.success('공지사항을 수정했습니다.');
    } else {
      const newNotice: MockNotice = {
        id: Date.now(),
        ...form,
        authorNickname: '관리자',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setNotices((prev) => [newNotice, ...prev]);
      toast.success('공지사항을 등록했습니다.');
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    toast.success('공지사항을 삭제했습니다.');
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">공지사항</h1>
          <p className="text-sm text-muted-foreground mt-0.5">공지사항을 작성하고 관리합니다.</p>
        </div>
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />공지 작성
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead>작성자</TableHead>
                <TableHead>작성일</TableHead>
                <TableHead>수정일</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notices.map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell className="font-medium text-sm">{notice.title}</TableCell>
                  <TableCell className="text-sm">{notice.authorNickname}</TableCell>
                  <TableCell className="text-sm">{notice.createdAt}</TableCell>
                  <TableCell className="text-sm">{notice.updatedAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleEdit(notice)}>
                        <PenLine className="mr-1 h-3 w-3" />수정
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => setDeleteId(notice.id)}>
                        <Trash2 className="mr-1 h-3 w-3" />삭제
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {notices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">등록된 공지사항이 없습니다.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editTarget ? '공지 수정' : '공지 작성'}</DialogTitle>
            <DialogDescription>{editTarget ? '공지사항 내용을 수정합니다.' : '새 공지사항을 등록합니다.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>제목</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="공지 제목" />
            </div>
            <div className="space-y-1.5">
              <Label>내용</Label>
              <Textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} placeholder="공지 내용을 입력하세요." rows={6} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>취소</Button>
            <Button disabled={!form.title || !form.content} onClick={handleSubmit}>{editTarget ? '수정' : '등록'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>공지사항을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => deleteId && handleDelete(deleteId)}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
