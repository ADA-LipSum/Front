import { useState } from 'react';
import { Send, History } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';

interface HistoryEntry {
  id: number;
  title: string;
  targetRole: string;
  senderNickname: string;
  sentAt: string;
}

const INITIAL_HISTORY: HistoryEntry[] = [
  { id: 1, title: '서비스 점검 안내', targetRole: '전체', senderNickname: '관리자', sentAt: '2024-01-15' },
  { id: 2, title: '선생님 공지 사항', targetRole: 'TEACHER', senderNickname: '관리자', sentAt: '2024-01-10' },
  { id: 3, title: '신년 이벤트 안내', targetRole: '전체', senderNickname: '관리자', sentAt: '2024-01-01' },
];

const ROLE_LABELS: Record<string, string> = { ALL: '전체', USER: '일반 사용자', TEACHER: '선생님', ADMIN: '관리자' };

export default function NotificationsPage() {
  const [history, setHistory] = useState<HistoryEntry[]>(INITIAL_HISTORY);
  const [form, setForm] = useState({ title: '', content: '', targetRole: 'ALL' });

  const handleSend = () => {
    const entry: HistoryEntry = {
      id: Date.now(),
      title: form.title,
      targetRole: ROLE_LABELS[form.targetRole] ?? form.targetRole,
      senderNickname: '관리자',
      sentAt: new Date().toISOString().split('T')[0],
    };
    setHistory((prev) => [entry, ...prev]);
    toast.success('알림을 발송했습니다.');
    setForm({ title: '', content: '', targetRole: 'ALL' });
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">알림 발송</h1>
        <p className="text-sm text-muted-foreground mt-0.5">전체 공지 알림을 발송하고 이력을 확인합니다.</p>
      </div>

      <Tabs defaultValue="send">
        <TabsList>
          <TabsTrigger value="send"><Send className="mr-2 h-4 w-4" />알림 발송</TabsTrigger>
          <TabsTrigger value="history"><History className="mr-2 h-4 w-4" />발송 이력</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">공지 알림 작성</CardTitle>
              <CardDescription>선택한 역할의 모든 사용자에게 알림을 발송합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              <div className="space-y-1.5">
                <Label>발송 대상</Label>
                <Select value={form.targetRole} onValueChange={(v) => setForm((f) => ({ ...f, targetRole: v ?? 'ALL' }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">전체 사용자</SelectItem>
                    <SelectItem value="USER">일반 사용자</SelectItem>
                    <SelectItem value="TEACHER">선생님</SelectItem>
                    <SelectItem value="ADMIN">관리자</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>알림 제목</Label>
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="알림 제목" />
              </div>
              <div className="space-y-1.5">
                <Label>알림 내용</Label>
                <Textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} placeholder="알림 내용을 입력하세요." rows={5} />
              </div>
              <Button className="w-full" disabled={!form.title || !form.content} onClick={handleSend}>
                <Send className="mr-2 h-4 w-4" />발송
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader><CardTitle className="text-base">발송 이력</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>제목</TableHead>
                    <TableHead>대상</TableHead>
                    <TableHead>발송자</TableHead>
                    <TableHead>발송일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell className="font-medium text-sm">{h.title}</TableCell>
                      <TableCell><Badge variant="secondary">{h.targetRole}</Badge></TableCell>
                      <TableCell className="text-sm">{h.senderNickname}</TableCell>
                      <TableCell className="text-sm">{h.sentAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
