import { useState } from 'react';
import { Coins, Users, History } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';

interface HistoryEntry {
  id: number;
  userNickname: string;
  type: 'ADD' | 'DEDUCT';
  amount: number;
  reason: string;
  createdAt: string;
}

const INITIAL_HISTORY: HistoryEntry[] = [
  { id: 1, userNickname: '홍길동', type: 'ADD', amount: 500, reason: '이벤트 보상', createdAt: '2024-01-15' },
  { id: 2, userNickname: '이순신', type: 'DEDUCT', amount: 100, reason: '제재 패널티', createdAt: '2024-01-14' },
  { id: 3, userNickname: '전체 USER', type: 'ADD', amount: 50, reason: '신년 이벤트 지급', createdAt: '2024-01-01' },
];

export default function CoinsPage() {
  const [history, setHistory] = useState<HistoryEntry[]>(INITIAL_HISTORY);
  const [individualForm, setIndividualForm] = useState({ userNickname: '', amount: '', reason: '', type: 'ADD' as 'ADD' | 'DEDUCT', target: 'coin' as 'coin' | 'point' });
  const [bulkForm, setBulkForm] = useState({ role: 'USER', amount: '', reason: '' });

  const handleIndividual = () => {
    const entry: HistoryEntry = {
      id: Date.now(),
      userNickname: individualForm.userNickname,
      type: individualForm.type,
      amount: Number(individualForm.amount),
      reason: individualForm.reason,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setHistory((prev) => [entry, ...prev]);
    toast.success(`${individualForm.type === 'ADD' ? '지급' : '차감'}을 완료했습니다.`);
    setIndividualForm((f) => ({ ...f, userNickname: '', amount: '', reason: '' }));
  };

  const handleBulk = () => {
    const entry: HistoryEntry = {
      id: Date.now(),
      userNickname: `전체 ${bulkForm.role}`,
      type: 'ADD',
      amount: Number(bulkForm.amount),
      reason: bulkForm.reason,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setHistory((prev) => [entry, ...prev]);
    toast.success('일괄 지급을 완료했습니다.');
    setBulkForm((f) => ({ ...f, amount: '', reason: '' }));
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">코인 / 포인트 관리</h1>
        <p className="text-sm text-muted-foreground mt-0.5">사용자 코인 및 포인트를 지급하거나 차감합니다.</p>
      </div>

      <Tabs defaultValue="individual">
        <TabsList>
          <TabsTrigger value="individual"><Coins className="mr-2 h-4 w-4" />개별 조정</TabsTrigger>
          <TabsTrigger value="bulk"><Users className="mr-2 h-4 w-4" />역할별 일괄 지급</TabsTrigger>
          <TabsTrigger value="history"><History className="mr-2 h-4 w-4" />지급 내역</TabsTrigger>
        </TabsList>

        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">개별 잔액 조정</CardTitle>
              <CardDescription>특정 사용자의 코인 또는 포인트를 조정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <Label>대상 화폐</Label>
                <Select value={individualForm.target} onValueChange={(v) => setIndividualForm((f) => ({ ...f, target: (v ?? 'coin') as 'coin' | 'point' }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coin">코인</SelectItem>
                    <SelectItem value="point">포인트</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>사용자 닉네임</Label>
                <Input value={individualForm.userNickname} onChange={(e) => setIndividualForm((f) => ({ ...f, userNickname: e.target.value }))} placeholder="닉네임" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>조정 유형</Label>
                  <Select value={individualForm.type} onValueChange={(v) => setIndividualForm((f) => ({ ...f, type: (v ?? 'ADD') as 'ADD' | 'DEDUCT' }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADD">지급</SelectItem>
                      <SelectItem value="DEDUCT">차감</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>수량</Label>
                  <Input type="number" value={individualForm.amount} onChange={(e) => setIndividualForm((f) => ({ ...f, amount: e.target.value }))} placeholder="0" min={1} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>사유</Label>
                <Input value={individualForm.reason} onChange={(e) => setIndividualForm((f) => ({ ...f, reason: e.target.value }))} placeholder="조정 사유" />
              </div>
              <Button className="w-full" onClick={handleIndividual} disabled={!individualForm.userNickname || !individualForm.amount || !individualForm.reason}>
                {individualForm.type === 'ADD' ? '지급' : '차감'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">역할별 일괄 코인 지급</CardTitle>
              <CardDescription>특정 역할의 모든 사용자에게 코인을 일괄 지급합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <Label>대상 역할</Label>
                <Select value={bulkForm.role} onValueChange={(v) => setBulkForm((f) => ({ ...f, role: v ?? 'USER' }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">일반 사용자</SelectItem>
                    <SelectItem value="TEACHER">선생님</SelectItem>
                    <SelectItem value="ADMIN">관리자</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>지급 수량</Label>
                <Input type="number" value={bulkForm.amount} onChange={(e) => setBulkForm((f) => ({ ...f, amount: e.target.value }))} placeholder="0" min={1} />
              </div>
              <div className="space-y-1.5">
                <Label>사유</Label>
                <Input value={bulkForm.reason} onChange={(e) => setBulkForm((f) => ({ ...f, reason: e.target.value }))} placeholder="지급 사유" />
              </div>
              <Button className="w-full" onClick={handleBulk} disabled={!bulkForm.amount || !bulkForm.reason}>일괄 지급</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">지급 내역</CardTitle>
              <CardDescription>코인 조정 이력을 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>대상</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead className="text-right">수량</TableHead>
                    <TableHead>사유</TableHead>
                    <TableHead>일시</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell className="text-sm font-medium">{h.userNickname}</TableCell>
                      <TableCell><Badge variant={h.type === 'ADD' ? 'default' : 'destructive'}>{h.type === 'ADD' ? '지급' : '차감'}</Badge></TableCell>
                      <TableCell className="text-right font-mono text-sm">{h.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{h.reason}</TableCell>
                      <TableCell className="text-sm">{h.createdAt}</TableCell>
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
