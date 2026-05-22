import { useState } from 'react';
import { Plus, MoreHorizontal, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'react-toastify';

interface MockItem {
  itemId: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

interface MockOrder {
  orderId: number;
  buyerNickname: string;
  itemName: string;
  price: number;
  status: 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

const INITIAL_ITEMS: MockItem[] = [
  { itemId: 1, name: '프리미엄 뱃지', description: '프로필에 표시되는 프리미엄 뱃지입니다.', price: 100, stock: 50, isActive: true, createdAt: '2024-01-01' },
  { itemId: 2, name: '닉네임 색상 변경권', description: '닉네임 색상을 변경할 수 있습니다.', price: 250, stock: 3, isActive: true, createdAt: '2024-01-02' },
  { itemId: 3, name: '이모지 팩', description: '특별 이모지 20종 세트입니다.', price: 80, stock: 0, isActive: false, createdAt: '2024-01-03' },
];

const INITIAL_ORDERS: MockOrder[] = [
  { orderId: 101, buyerNickname: '홍길동', itemName: '프리미엄 뱃지', price: 100, status: 'COMPLETED', createdAt: '2024-01-15' },
  { orderId: 102, buyerNickname: '이순신', itemName: '닉네임 색상 변경권', price: 250, status: 'COMPLETED', createdAt: '2024-01-14' },
  { orderId: 103, buyerNickname: '세종대왕', itemName: '이모지 팩', price: 80, status: 'CANCELLED', createdAt: '2024-01-13' },
];

export default function ShopPage() {
  const [items, setItems] = useState<MockItem[]>(INITIAL_ITEMS);
  const [orders, setOrders] = useState<MockOrder[]>(INITIAL_ORDERS);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
  const [stockDialog, setStockDialog] = useState<{ itemId: number; name: string } | null>(null);
  const [stockAmount, setStockAmount] = useState('');

  const handleDeleteItem = (itemId: number) => {
    setItems((prev) => prev.filter((i) => i.itemId !== itemId));
    toast.success('아이템을 삭제했습니다.');
    setDeleteItemId(null);
  };

  const handleCancelOrder = (orderId: number) => {
    setOrders((prev) => prev.map((o) => o.orderId === orderId ? { ...o, status: 'CANCELLED' as const } : o));
    toast.success('주문을 취소하고 환불했습니다.');
    setCancelOrderId(null);
  };

  const handleRechargeStock = () => {
    if (!stockDialog) return;
    setItems((prev) => prev.map((i) => i.itemId === stockDialog.itemId ? { ...i, stock: i.stock + Number(stockAmount) } : i));
    toast.success('재고를 충전했습니다.');
    setStockDialog(null);
    setStockAmount('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">상점 / 거래 관리</h1>
          <p className="text-sm text-muted-foreground mt-0.5">거래 아이템과 주문 내역을 관리합니다.</p>
        </div>
        <Button size="sm"><Plus className="mr-2 h-4 w-4" />아이템 등록</Button>
      </div>

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">아이템 목록</TabsTrigger>
          <TabsTrigger value="orders">주문 내역</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>아이템명</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead className="text-right">가격 (코인)</TableHead>
                    <TableHead className="text-right">재고</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>등록일</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.itemId}>
                      <TableCell className="font-medium text-sm">{item.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{item.description}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{item.price.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm">
                        <span className={item.stock < 5 ? 'text-destructive font-medium' : ''}>{item.stock}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.isActive ? 'default' : 'outline'}>{item.isActive ? '판매 중' : '중단'}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{item.createdAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent focus-visible:outline-none">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setStockDialog({ itemId: item.itemId, name: item.name })}>
                              <Package className="mr-2 h-4 w-4" />재고 충전
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => setDeleteItemId(item.itemId)}>삭제</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>주문 번호</TableHead>
                    <TableHead>구매자</TableHead>
                    <TableHead>아이템</TableHead>
                    <TableHead className="text-right">금액 (코인)</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>주문일</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell className="font-mono text-sm">#{order.orderId}</TableCell>
                      <TableCell className="text-sm">{order.buyerNickname}</TableCell>
                      <TableCell className="text-sm">{order.itemName}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{order.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'COMPLETED' ? 'default' : 'secondary'}>
                          {order.status === 'COMPLETED' ? '완료' : '취소'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{order.createdAt}</TableCell>
                      <TableCell className="text-right">
                        {order.status === 'COMPLETED' && (
                          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setCancelOrderId(order.orderId)}>취소/환불</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stock Recharge */}
      <Dialog open={!!stockDialog} onOpenChange={() => setStockDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>재고 충전</DialogTitle>
            <DialogDescription>{stockDialog?.name} 아이템의 재고를 충전합니다.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-1.5">
            <Label>충전 수량</Label>
            <Input type="number" value={stockAmount} onChange={(e) => setStockAmount(e.target.value)} placeholder="0" min={1} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStockDialog(null)}>취소</Button>
            <Button disabled={!stockAmount} onClick={handleRechargeStock}>충전</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>아이템을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => deleteItemId && handleDeleteItem(deleteItemId)}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!cancelOrderId} onOpenChange={() => setCancelOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>주문을 취소하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>코인이 구매자에게 환불됩니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={() => cancelOrderId && handleCancelOrder(cancelOrderId)}>취소 / 환불</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
