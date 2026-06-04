import { useEffect, useState } from 'react';
import { Plus, MoreHorizontal, Package, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'react-toastify';
import {
  getTradeItems,
  getTradeOrders,
  createTradeItem,
  updateTradeItem,
  deleteTradeItem,
  rechargeStock,
  cancelOrder,
  type TradeItem,
  type TradeOrder,
  type PagedResponse,
} from '@/api/admin';

const CATEGORY_LABELS: Record<string, string> = {
  FOOD: '음식 (코인)',
  ETC: '기타 (포인트)',
};

const SUB_CATEGORY_LABELS: Record<string, string> = {
  SNACK: '과자',
  CANDY: '사탕',
  JUICE: '음료',
  INSTANT: '인스턴스',
  STICKER: '스티커',
  BANNER: '배너',
};

export default function ShopPage() {
  const [items, setItems] = useState<TradeItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [ordersData, setOrdersData] = useState<PagedResponse<TradeOrder> | null>(null);
  const [ordersPage, setOrdersPage] = useState(0);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'FOOD' as 'FOOD' | 'ETC',
    subCategory: '' as string,
    imageUrl: '',
  });

  const [editTarget, setEditTarget] = useState<TradeItem | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', active: true });
  const [editing, setEditing] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<TradeItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [stockTarget, setStockTarget] = useState<TradeItem | null>(null);
  const [stockAmount, setStockAmount] = useState('');
  const [rechargingStock, setRechargingStock] = useState(false);

  const [cancelTarget, setCancelTarget] = useState<TradeOrder | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const loadItems = () => {
    setItemsLoading(true);
    getTradeItems()
      .then(setItems)
      .catch(() => toast.error('아이템 목록을 불러오지 못했습니다.'))
      .finally(() => setItemsLoading(false));
  };

  const loadOrders = (page: number) => {
    setOrdersLoading(true);
    getTradeOrders({ page, size: 20 })
      .then(setOrdersData)
      .catch(() => toast.error('주문 목록을 불러오지 못했습니다.'))
      .finally(() => setOrdersLoading(false));
  };

  useEffect(() => {
    loadItems();
  }, []);
  useEffect(() => {
    loadOrders(ordersPage);
  }, [ordersPage]);

  const handleCreate = async () => {
    if (!createForm.name || !createForm.price) return;
    setCreating(true);
    try {
      await createTradeItem({
        name: createForm.name,
        description: createForm.description || undefined,
        price: Number(createForm.price),
        stock: createForm.stock ? Number(createForm.stock) : undefined,
        active: true,
        category: createForm.category,
        subCategory:
          (createForm.subCategory as
            | 'SNACK'
            | 'CANDY'
            | 'JUICE'
            | 'INSTANT'
            | 'STICKER'
            | 'BANNER') || undefined,
        imageUrl: createForm.imageUrl || undefined,
      });
      toast.success('아이템을 등록했습니다.');
      setCreateOpen(false);
      setCreateForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: 'FOOD',
        subCategory: '',
        imageUrl: '',
      });
      loadItems();
    } catch {
      toast.error('아이템 등록에 실패했습니다.');
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    setEditing(true);
    try {
      await updateTradeItem(editTarget.itemUuid, {
        name: editForm.name,
        description: editForm.description,
        price: Number(editForm.price),
        active: editForm.active,
      });
      toast.success('아이템을 수정했습니다.');
      setEditTarget(null);
      loadItems();
    } catch {
      toast.error('수정에 실패했습니다.');
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTradeItem(deleteTarget.itemUuid);
      toast.success('아이템을 삭제했습니다.');
      setDeleteTarget(null);
      loadItems();
    } catch {
      toast.error('삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  const handleRechargeStock = async () => {
    if (!stockTarget || !stockAmount) return;
    setRechargingStock(true);
    try {
      await rechargeStock(stockTarget.itemUuid, Number(stockAmount));
      toast.success('재고를 충전했습니다.');
      setStockTarget(null);
      setStockAmount('');
      loadItems();
    } catch {
      toast.error('재고 충전에 실패했습니다.');
    } finally {
      setRechargingStock(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await cancelOrder(cancelTarget.orderId);
      toast.success('주문을 취소하고 환불했습니다.');
      setCancelTarget(null);
      loadOrders(ordersPage);
    } catch {
      toast.error('주문 취소에 실패했습니다.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">상점 / 거래 관리</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            거래 아이템과 주문 내역을 관리합니다.
          </p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          아이템 등록
        </Button>
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
                  {itemsLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        아이템이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => (
                      <TableRow key={item.itemUuid}>
                        <TableCell className="font-medium text-sm">{item.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                          {item.description}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {item.price.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          <span className={item.stock < 5 ? 'text-destructive font-medium' : ''}>
                            {item.stock}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.active ? 'default' : 'outline'}>
                            {item.active ? '판매 중' : '중단'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent focus-visible:outline-none">
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditTarget(item);
                                  setEditForm({
                                    name: item.name,
                                    description: item.description,
                                    price: String(item.price),
                                    active: item.active,
                                  });
                                }}
                              >
                                수정
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setStockTarget(item);
                                  setStockAmount('');
                                }}
                              >
                                <Package className="mr-2 h-4 w-4" />
                                재고 충전
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setDeleteTarget(item)}
                              >
                                삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
                    <TableHead>주문 ID</TableHead>
                    <TableHead>구매자</TableHead>
                    <TableHead>아이템</TableHead>
                    <TableHead className="text-right">금액 (코인)</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>주문일</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : (ordersData?.content ?? []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        주문이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (ordersData?.content ?? []).map((order) => (
                      <TableRow key={order.orderId}>
                        <TableCell className="font-mono text-xs">{order.orderId}</TableCell>
                        <TableCell className="text-sm">{order.buyerNickname}</TableCell>
                        <TableCell className="text-sm">{order.itemName}</TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {order.price.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'COMPLETED' ? 'default' : 'secondary'}>
                            {order.status === 'COMPLETED' ? '완료' : '취소'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                        </TableCell>
                        <TableCell className="text-right">
                          {order.status === 'COMPLETED' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => setCancelTarget(order)}
                            >
                              취소/환불
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {(ordersData?.totalPages ?? 1) > 1 && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={ordersPage === 0}
                onClick={() => setOrdersPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {ordersPage + 1} / {ordersData!.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={ordersPage >= (ordersData?.totalPages ?? 1) - 1}
                onClick={() => setOrdersPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 아이템 등록 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>아이템 등록</DialogTitle>
            <DialogDescription>새 거래 아이템을 등록합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>아이템명</Label>
              <Input
                value={createForm.name}
                onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="아이템 이름"
              />
            </div>
            <div className="space-y-1.5">
              <Label>설명 (선택)</Label>
              <Input
                value={createForm.description}
                onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="아이템 설명"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>카테고리</Label>
                <Select
                  value={createForm.category}
                  onValueChange={(v) =>
                    setCreateForm((f) => ({ ...f, category: v as 'FOOD' | 'ETC', subCategory: '' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue>{CATEGORY_LABELS[createForm.category] ?? createForm.category}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FOOD">음식 (코인)</SelectItem>
                    <SelectItem value="ETC">기타 (포인트)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>서브카테고리 (선택)</Label>
                <Select
                  value={createForm.subCategory}
                  onValueChange={(v) => setCreateForm((f) => ({ ...f, subCategory: v ?? '' }))}
                >
                  <SelectTrigger>
                    {createForm.subCategory ? (
                      <SelectValue>{SUB_CATEGORY_LABELS[createForm.subCategory] ?? createForm.subCategory}</SelectValue>
                    ) : (
                      <SelectValue placeholder="없음" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {createForm.category === 'FOOD' ? (
                      <>
                        <SelectItem value="SNACK">과자</SelectItem>
                        <SelectItem value="CANDY">사탕</SelectItem>
                        <SelectItem value="JUICE">음료</SelectItem>
                        <SelectItem value="INSTANT">인스턴스</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="STICKER">스티커</SelectItem>
                        <SelectItem value="BANNER">배너</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>가격</Label>
                <Input
                  type="number"
                  value={createForm.price}
                  onChange={(e) => setCreateForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="0"
                  min={0}
                />
              </div>
              <div className="space-y-1.5">
                <Label>초기 재고</Label>
                <Input
                  type="number"
                  value={createForm.stock}
                  onChange={(e) => setCreateForm((f) => ({ ...f, stock: e.target.value }))}
                  placeholder="0"
                  min={0}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>이미지 URL (선택)</Label>
              <Input
                value={createForm.imageUrl}
                onChange={(e) => setCreateForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              취소
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!createForm.name || !createForm.price || creating}
            >
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}등록
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 아이템 수정 */}
      <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>아이템 수정</DialogTitle>
            <DialogDescription>'{editTarget?.name}' 아이템을 수정합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>아이템명</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>설명</Label>
              <Input
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>가격 (코인)</Label>
              <Input
                type="number"
                value={editForm.price}
                onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
                min={0}
              />
            </div>
            <div className="space-y-1.5">
              <Label>판매 상태</Label>
              <Select
                value={editForm.active ? 'active' : 'inactive'}
                onValueChange={(v) => setEditForm((f) => ({ ...f, active: v === 'active' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">판매 중</SelectItem>
                  <SelectItem value="inactive">판매 중단</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              취소
            </Button>
            <Button onClick={handleEdit} disabled={!editForm.name || !editForm.price || editing}>
              {editing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 재고 충전 */}
      <Dialog open={!!stockTarget} onOpenChange={() => setStockTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>재고 충전</DialogTitle>
            <DialogDescription>'{stockTarget?.name}' 아이템의 재고를 충전합니다.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-1.5">
            <Label>충전 수량</Label>
            <Input
              type="number"
              value={stockAmount}
              onChange={(e) => setStockAmount(e.target.value)}
              placeholder="0"
              min={1}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStockTarget(null)}>
              취소
            </Button>
            <Button disabled={!stockAmount || rechargingStock} onClick={handleRechargeStock}>
              {rechargingStock && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}충전
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 아이템 삭제 */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>'{deleteTarget?.name}' 아이템을 삭제하시겠습니까?</AlertDialogTitle>
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

      {/* 주문 취소 */}
      <AlertDialog open={!!cancelTarget} onOpenChange={() => setCancelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>주문을 취소하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              '{cancelTarget?.itemName}' 주문이 취소되며 코인이 구매자에게 환불됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelOrder} disabled={cancelling}>
              {cancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}취소 / 환불
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
