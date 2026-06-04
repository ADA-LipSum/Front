import { useEffect, useState } from 'react';
import { Coins, Users, History, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import {
  getUserBalances, adjustCoins, adjustPoints, bulkAdjustCoins, getCoinHistory,
  type BalanceInfo, type CoinHistory, type PagedResponse,
} from '@/api/admin';

export default function CoinsPage() {
  const [balances, setBalances] = useState<BalanceInfo[]>([]);
  const [balancesLoading, setBalancesLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<BalanceInfo | null>(null);

  const [individualForm, setIndividualForm] = useState({
    amount: '',
    reason: '',
    type: 'ADD' as 'ADD' | 'DEDUCT',
    target: 'coin' as 'coin' | 'point',
  });
  const [submitting, setSubmitting] = useState(false);

  const [bulkForm, setBulkForm] = useState({ role: 'STUDENT', type: 'GAIN' as 'GAIN' | 'LOSS', coins: '', description: '' });
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

  const [historyData, setHistoryData] = useState<PagedResponse<CoinHistory> | null>(null);
  const [historyPage, setHistoryPage] = useState(0);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    getUserBalances()
      .then(setBalances)
      .catch(() => toast.error('잔액 목록을 불러오지 못했습니다.'))
      .finally(() => setBalancesLoading(false));
  }, []);

  const loadHistory = (page: number) => {
    setHistoryLoading(true);
    getCoinHistory({ page, size: 20 })
      .then(setHistoryData)
      .catch(() => toast.error('내역을 불러오지 못했습니다.'))
      .finally(() => setHistoryLoading(false));
  };

  useEffect(() => { loadHistory(historyPage); }, [historyPage]);

  const filteredBalances = balances.filter(
    (u) =>
      !userSearch ||
      u.userNickname.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.adminId.toLowerCase().includes(userSearch.toLowerCase()),
  );

  const handleIndividual = async () => {
    if (!selectedUser || !individualForm.amount || !individualForm.reason) return;
    setSubmitting(true);
    try {
      const payload = {
        userUuid: selectedUser.uuid,
        amount: Number(individualForm.amount),
        reason: individualForm.reason,
        type: individualForm.type,
      };
      if (individualForm.target === 'coin') {
        await adjustCoins(payload);
      } else {
        await adjustPoints(payload);
      }
      toast.success(`${individualForm.type === 'ADD' ? '지급' : '차감'}을 완료했습니다.`);
      setIndividualForm((f) => ({ ...f, amount: '', reason: '' }));
      loadHistory(0);
      setHistoryPage(0);
    } catch {
      toast.error('처리에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulk = async () => {
    if (!bulkForm.coins || !bulkForm.description) return;
    setBulkSubmitting(true);
    try {
      await bulkAdjustCoins({
        role: bulkForm.role,
        type: bulkForm.type,
        coins: Number(bulkForm.coins),
        description: bulkForm.description,
      });
      toast.success('일괄 지급을 완료했습니다.');
      setBulkForm((f) => ({ ...f, coins: '', description: '' }));
      loadHistory(0);
      setHistoryPage(0);
    } catch {
      toast.error('처리에 실패했습니다.');
    } finally {
      setBulkSubmitting(false);
    }
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">사용자 검색</CardTitle>
                <CardDescription>잔액을 조정할 사용자를 선택합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="닉네임 또는 아이디 검색..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-8 h-8"
                  />
                </div>
                {balancesLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {filteredBalances.slice(0, 50).map((u) => (
                      <button
                        key={u.uuid}
                        type="button"
                        className={`w-full text-left rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent ${selectedUser?.uuid === u.uuid ? 'bg-accent font-medium' : ''}`}
                        onClick={() => setSelectedUser(u)}
                      >
                        <div className="font-medium">{u.userNickname}</div>
                        <div className="text-xs text-muted-foreground">{u.adminId} · 코인 {u.coinBalance.toLocaleString()} · 포인트 {u.pointBalance.toLocaleString()}</div>
                      </button>
                    ))}
                    {filteredBalances.length === 0 && (
                      <p className="text-center py-4 text-sm text-muted-foreground">검색 결과가 없습니다.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">잔액 조정</CardTitle>
                <CardDescription>
                  {selectedUser ? `${selectedUser.userNickname} 선택됨` : '왼쪽에서 사용자를 선택하세요.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>대상 화폐</Label>
                  <Select value={individualForm.target} onValueChange={(v) => setIndividualForm((f) => ({ ...f, target: (v ?? 'coin') as 'coin' | 'point' }))}>
                    <SelectTrigger><SelectValue>{{ coin: '코인', point: '포인트' }[individualForm.target] ?? individualForm.target}</SelectValue></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coin">코인</SelectItem>
                      <SelectItem value="point">포인트</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>조정 유형</Label>
                    <Select value={individualForm.type} onValueChange={(v) => setIndividualForm((f) => ({ ...f, type: (v ?? 'ADD') as 'ADD' | 'DEDUCT' }))}>
                      <SelectTrigger><SelectValue>{{ ADD: '지급', DEDUCT: '차감' }[individualForm.type] ?? individualForm.type}</SelectValue></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADD">지급</SelectItem>
                        <SelectItem value="DEDUCT">차감</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>수량</Label>
                    <Input
                      type="number"
                      value={individualForm.amount}
                      onChange={(e) => setIndividualForm((f) => ({ ...f, amount: e.target.value }))}
                      placeholder="0"
                      min={1}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>사유</Label>
                  <Input
                    value={individualForm.reason}
                    onChange={(e) => setIndividualForm((f) => ({ ...f, reason: e.target.value }))}
                    placeholder="조정 사유"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleIndividual}
                  disabled={!selectedUser || !individualForm.amount || !individualForm.reason || submitting}
                >
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {individualForm.type === 'ADD' ? '지급' : '차감'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">역할별 일괄 코인 지급 / 차감</CardTitle>
              <CardDescription>특정 역할의 모든 사용자에게 코인을 일괄 처리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <Label>대상 역할</Label>
                <Select value={bulkForm.role} onValueChange={(v) => setBulkForm((f) => ({ ...f, role: v ?? 'STUDENT' }))}>
                  <SelectTrigger><SelectValue>{{ STUDENT: '학생', MENTOR: '멘토', TEACHER: '선생님', ADMIN: '관리자' }[bulkForm.role] ?? bulkForm.role}</SelectValue></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">학생</SelectItem>
                    <SelectItem value="MENTOR">멘토</SelectItem>
                    <SelectItem value="TEACHER">선생님</SelectItem>
                    <SelectItem value="ADMIN">관리자</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>처리 유형</Label>
                  <Select value={bulkForm.type} onValueChange={(v) => setBulkForm((f) => ({ ...f, type: (v ?? 'GAIN') as 'GAIN' | 'LOSS' }))}>
                    <SelectTrigger><SelectValue>{{ GAIN: '지급', LOSS: '차감' }[bulkForm.type] ?? bulkForm.type}</SelectValue></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GAIN">지급</SelectItem>
                      <SelectItem value="LOSS">차감</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>코인 수량</Label>
                  <Input
                    type="number"
                    value={bulkForm.coins}
                    onChange={(e) => setBulkForm((f) => ({ ...f, coins: e.target.value }))}
                    placeholder="0"
                    min={1}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>설명</Label>
                <Input
                  value={bulkForm.description}
                  onChange={(e) => setBulkForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="지급 / 차감 사유"
                />
              </div>
              <Button
                className="w-full"
                onClick={handleBulk}
                disabled={!bulkForm.coins || !bulkForm.description || bulkSubmitting}
              >
                {bulkSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                일괄 {bulkForm.type === 'GAIN' ? '지급' : '차감'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">코인 조정 내역</CardTitle>
              <CardDescription>코인 지급 및 차감 이력을 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>사용자 UUID</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead className="text-right">수량</TableHead>
                    <TableHead className="text-right">변경 후</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead>일시</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : (historyData?.content ?? []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">내역이 없습니다.</TableCell>
                    </TableRow>
                  ) : (
                    (historyData?.content ?? []).map((h) => (
                      <TableRow key={h.coinUuid}>
                        <TableCell className="font-mono text-xs">{h.userUuid}</TableCell>
                        <TableCell>
                          <Badge variant={h.changeType === 'GAIN' ? 'default' : 'destructive'}>
                            {h.changeType === 'GAIN' ? '지급' : '차감'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">{h.coins.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono text-sm">{h.balanceAfter.toLocaleString()}</TableCell>
                        <TableCell className="text-sm max-w-[180px] truncate">{h.description}</TableCell>
                        <TableCell className="text-sm">{new Date(h.createdAt).toLocaleDateString('ko-KR')}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {(historyData?.totalPages ?? 1) > 1 && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <Button variant="outline" size="sm" disabled={historyPage === 0} onClick={() => setHistoryPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">{historyPage + 1} / {historyData!.totalPages}</span>
              <Button variant="outline" size="sm" disabled={historyPage >= (historyData?.totalPages ?? 1) - 1} onClick={() => setHistoryPage((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
