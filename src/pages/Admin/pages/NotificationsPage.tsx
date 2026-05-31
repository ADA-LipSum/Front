import { useEffect, useState } from 'react';
import { Send, History, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import { sendNotification, getNotificationHistory, type NotificationHistory } from '@/api/admin';

const TYPE_LABELS: Record<string, string> = {
  POLL_ENDED: '투표 종료',
  NOTICE: '공지',
  SYSTEM: '시스템',
};

export default function NotificationsPage() {
  const [form, setForm] = useState({ title: '', message: '', targetRole: 'ALL' });
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('send');

  const fetchHistory = () => {
    setHistoryLoading(true);
    getNotificationHistory({ page: 0, size: 50 })
      .then((data) => setHistory(data.content))
      .catch(() => toast.error('발송 이력을 불러오지 못했습니다.'))
      .finally(() => setHistoryLoading(false));
  };

  useEffect(() => {
    if (activeTab === 'history') fetchHistory();
  }, [activeTab]);

  const handleSend = async () => {
    setSending(true);
    try {
      await sendNotification({
        title: form.title,
        message: form.message,
        targetRole: form.targetRole === 'ALL' ? null : form.targetRole,
      });
      toast.success('알림을 발송했습니다.');
      setForm({ title: '', message: '', targetRole: 'ALL' });
    } catch {
      toast.error('알림 발송에 실패했습니다.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">알림 발송</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          전체 공지 알림을 발송하고 이력을 확인합니다.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="send">
            <Send className="mr-2 h-4 w-4" />
            알림 발송
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            발송 이력
          </TabsTrigger>
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
                <Select
                  value={form.targetRole}
                  onValueChange={(v) => setForm((f) => ({ ...f, targetRole: v ?? 'ALL' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">전체 사용자</SelectItem>
                    <SelectItem value="STUDENT">학생</SelectItem>
                    <SelectItem value="TEACHER">선생님</SelectItem>
                    <SelectItem value="ADMIN">관리자</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>알림 제목</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="알림 제목"
                />
              </div>
              <div className="space-y-1.5">
                <Label>알림 내용</Label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="알림 내용을 입력하세요."
                  rows={5}
                />
              </div>
              <Button
                className="w-full"
                disabled={!form.title || !form.message || sending}
                onClick={handleSend}
              >
                {sending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                발송
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">발송 이력</CardTitle>
              <Button variant="outline" size="sm" onClick={fetchHistory} disabled={historyLoading}>
                {historyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : '새로고침'}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>제목</TableHead>
                    <TableHead>내용</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>발송일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                        발송 이력이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell className="font-medium text-sm">{h.title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-60 truncate">
                          {h.message}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{TYPE_LABELS[h.type] ?? h.type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(h.createdAt).toLocaleDateString('ko-KR')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
