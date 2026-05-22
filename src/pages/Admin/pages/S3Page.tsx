import { useState } from 'react';
import { FolderPlus, Upload, Trash2, Search, Folder, FileIcon, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'react-toastify';

interface MockS3Object {
  key: string;
  size: number;
  lastModified: string;
  isFolder: boolean;
}

const ROOT_OBJECTS: MockS3Object[] = [
  { key: 'profiles/', size: 0, lastModified: '2024-01-10', isFolder: true },
  { key: 'posts/', size: 0, lastModified: '2024-01-12', isFolder: true },
  { key: 'banners/', size: 0, lastModified: '2024-01-05', isFolder: true },
  { key: 'README.txt', size: 1024, lastModified: '2024-01-01', isFolder: false },
];

const FOLDER_CONTENTS: Record<string, MockS3Object[]> = {
  'profiles/': [
    { key: 'profiles/user_001.jpg', size: 204800, lastModified: '2024-01-15', isFolder: false },
    { key: 'profiles/user_002.png', size: 153600, lastModified: '2024-01-14', isFolder: false },
    { key: 'profiles/default.png', size: 51200, lastModified: '2024-01-01', isFolder: false },
  ],
  'posts/': [
    { key: 'posts/img_001.jpg', size: 512000, lastModified: '2024-01-13', isFolder: false },
    { key: 'posts/img_002.jpg', size: 307200, lastModified: '2024-01-12', isFolder: false },
  ],
  'banners/': [
    { key: 'banners/main_banner.jpg', size: 1048576, lastModified: '2024-01-05', isFolder: false },
  ],
};

function formatBytes(bytes: number) {
  if (bytes === 0) return '-';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function S3Page() {
  const [prefix, setPrefix] = useState('');
  const [search, setSearch] = useState('');
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const [folderOpen, setFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [deletedKeys, setDeletedKeys] = useState<string[]>([]);
  const [extraFolders, setExtraFolders] = useState<MockS3Object[]>([]);

  const currentObjects = [
    ...(prefix ? FOLDER_CONTENTS[prefix] ?? [] : ROOT_OBJECTS),
    ...(prefix ? [] : extraFolders),
  ].filter((o) => !deletedKeys.includes(o.key));

  const filtered = currentObjects.filter(
    (o) => !search || o.key.toLowerCase().includes(search.toLowerCase()),
  );

  const breadcrumbs = prefix ? prefix.split('/').filter(Boolean) : [];

  const handleDelete = (key: string) => {
    setDeletedKeys((prev) => [...prev, key]);
    toast.success('파일을 삭제했습니다.');
    setDeleteKey(null);
  };

  const handleCreateFolder = () => {
    const folderKey = `${prefix}${newFolderName}/`;
    const newFolder: MockS3Object = { key: folderKey, size: 0, lastModified: new Date().toISOString().split('T')[0], isFolder: true };
    if (prefix === '') setExtraFolders((prev) => [...prev, newFolder]);
    toast.success('폴더를 생성했습니다.');
    setFolderOpen(false);
    setNewFolderName('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">S3 파일 관리</h1>
          <p className="text-sm text-muted-foreground mt-0.5">S3 버킷 내 파일을 조회하고 관리합니다.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setFolderOpen(true)}>
            <FolderPlus className="mr-2 h-4 w-4" />폴더 생성
          </Button>
          <Button size="sm">
            <Upload className="mr-2 h-4 w-4" />파일 업로드
          </Button>
        </div>
      </div>

      {/* Breadcrumb path */}
      <div className="flex items-center gap-1 text-sm">
        <button className="text-primary hover:underline" onClick={() => setPrefix('')}>root</button>
        {breadcrumbs.map((part, i) => (
          <span key={i} className="flex items-center gap-1">
            <span className="text-muted-foreground">/</span>
            <button className="text-primary hover:underline" onClick={() => setPrefix(breadcrumbs.slice(0, i + 1).join('/') + '/')}>
              {part}
            </button>
          </span>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="파일 / 폴더 검색..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8" />
            </div>
            <Button variant="outline" size="sm" className="h-8" onClick={() => toast.info('새로고침했습니다.')}>
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>유형</TableHead>
                <TableHead className="text-right">크기</TableHead>
                <TableHead>수정일</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((obj) => {
                const name = obj.key.split('/').filter(Boolean).pop() ?? obj.key;
                return (
                  <TableRow key={obj.key} className={obj.isFolder ? 'cursor-pointer' : ''} onClick={() => obj.isFolder && setPrefix(obj.key)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {obj.isFolder ? <Folder className="h-4 w-4 text-blue-400" /> : <FileIcon className="h-4 w-4 text-muted-foreground" />}
                        <span className="text-sm font-medium">{name}{obj.isFolder ? '/' : ''}</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{obj.isFolder ? '폴더' : '파일'}</Badge></TableCell>
                    <TableCell className="text-right text-sm font-mono">{formatBytes(obj.size)}</TableCell>
                    <TableCell className="text-sm">{obj.lastModified}</TableCell>
                    <TableCell className="text-right">
                      {!obj.isFolder && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteKey(obj.key); }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">파일이 없습니다.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={folderOpen} onOpenChange={setFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>폴더 생성</DialogTitle>
            <DialogDescription>새 폴더 이름을 입력하세요.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-1.5">
            <Label>폴더 이름</Label>
            <Input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="폴더 이름" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFolderOpen(false)}>취소</Button>
            <Button disabled={!newFolderName} onClick={handleCreateFolder}>생성</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteKey} onOpenChange={() => setDeleteKey(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>파일을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-mono text-xs">{deleteKey}</span>
              <br />이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => deleteKey && handleDelete(deleteKey)}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
