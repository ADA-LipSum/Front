import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchMyCoinBalance } from '@/api/coins';
import { fetchMyPointBalance } from '@/api/points';
import {
  purchaseTradeItem,
  searchTradeItems,
  type TradeItem,
} from '@/api/trade';

type ExchangeMode = 'COIN' | 'POINT';
type CoinFilterMode = 'ALL' | 'IN_CART';
type CoinCategory = 'ALL' | 'SNACK' | 'CANDY_CHOCOLATE' | 'MEAL' | 'DRINK';

interface ExchangeItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: ExchangeMode;
  category: CoinCategory;
  stock: number;
  imageUrl?: string | null;
}

interface CartItem {
  item: ExchangeItem;
  quantity: number;
}

const COIN_ITEMS_PER_PAGE = 20; // 5 x 4
const POINT_ITEMS_PER_PAGE = 12;
type AuthUser = ReturnType<typeof useAuthStore.getState>['user'];
const getAuthUserUuid = (user: AuthUser): string | undefined => {
  if (!user) return undefined;
  const u = user as { uuid?: string; userUuid?: string };
  const raw = u.uuid ?? u.userUuid;
  const s = raw != null ? String(raw).trim() : '';
  return s.length > 0 ? s : undefined;
};

export const Exchange = () => {
  const { user } = useAuthStore();
  const authUserUuid = useMemo(() => getAuthUserUuid(user), [user]);

  const [mode, setMode] = useState<ExchangeMode>('COIN');
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [items, setItems] = useState<ExchangeItem[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [coinFilter, setCoinFilter] = useState<CoinFilterMode>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<CoinCategory>('ALL');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [draftCoinFilter, setDraftCoinFilter] = useState<CoinFilterMode>('ALL');
  const [draftCategoryFilter, setDraftCategoryFilter] =
    useState<CoinCategory>('ALL');
  const [draftMinPrice, setDraftMinPrice] = useState('');
  const [draftMaxPrice, setDraftMaxPrice] = useState('');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addTarget, setAddTarget] = useState<ExchangeItem | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedPointItem, setSelectedPointItem] = useState<ExchangeItem | null>(
    null,
  );

  const [myCoinBalance, setMyCoinBalance] = useState<number | null>(null);
  const [myPointBalance, setMyPointBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const mapCategory = (item: TradeItem): CoinCategory => {
    const text = `${item.name} ${item.description}`.toLowerCase();
    if (/초콜릿|캔디|사탕|choco|candy/.test(text)) return 'CANDY_CHOCOLATE';
    if (/라면|컵밥|즉석|도시락|meal/.test(text)) return 'MEAL';
    if (/음료|커피|주스|탄산|차|drink/.test(text)) return 'DRINK';
    return 'SNACK';
  };

  const toExchangeItem = (item: TradeItem, itemType: ExchangeMode): ExchangeItem => ({
    id: item.itemUuid,
    name: item.name,
    description: item.description,
    price: item.price,
    type: itemType,
    category: mapCategory(item),
    stock: item.stock,
    imageUrl: item.imageUrl,
  });

  const loadBalance = async () => {
    if (!authUserUuid) {
      setMyCoinBalance(null);
      setMyPointBalance(null);
      setBalanceError(null);
      return;
    }
    try {
      setBalanceLoading(true);
      setBalanceError(null);
      const [coins, points] = await Promise.all([
        fetchMyCoinBalance(authUserUuid),
        fetchMyPointBalance(authUserUuid),
      ]);
      setMyCoinBalance(coins);
      setMyPointBalance(points);
    } catch (err) {
      console.error(err);
      const message =
        err && typeof err === 'object' && 'response' in err
          ? ((err as { response?: { data?: { message?: string } } }).response?.data
              ?.message ?? '잔액을 불러오지 못했습니다.')
          : '잔액을 불러오지 못했습니다.';
      setBalanceError(message);
      setMyCoinBalance(null);
      setMyPointBalance(null);
    } finally {
      setBalanceLoading(false);
    }
  };

  const coinBalanceLine = useMemo(() => {
    if (!authUserUuid) return '로그인 후 확인';
    if (balanceLoading) return '불러오는 중…';
    if (balanceError) return balanceError;
    if (myCoinBalance !== null) return `${myCoinBalance.toLocaleString('ko-KR')} 코인`;
    return '불러오는 중…';
  }, [authUserUuid, balanceLoading, balanceError, myCoinBalance]);

  const pointBalanceLine = useMemo(() => {
    if (!authUserUuid) return '로그인 후 확인';
    if (balanceLoading) return '불러오는 중…';
    if (balanceError) return balanceError;
    if (myPointBalance !== null) return `${myPointBalance.toLocaleString('ko-KR')} 포인트`;
    return '불러오는 중…';
  }, [authUserUuid, balanceLoading, balanceError, myPointBalance]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const result = await searchTradeItems({
        category: mode === 'COIN' ? 'FOOD' : 'ETC',
        keyword: keyword.trim() || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        page: 0,
        size: 200,
      });
      setItems(result.items.map((item) => toExchangeItem(item, mode)));
    } catch (err) {
      console.error(err);
      const message =
        err && typeof err === 'object' && 'response' in err
          ? ((err as { response?: { data?: { message?: string } } }).response?.data
              ?.message ?? '아이템 목록을 불러오지 못했습니다.')
          : '아이템 목록을 불러오지 못했습니다.';
      setLoadError(message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, keyword, minPrice, maxPrice]);

  useEffect(() => {
    void loadBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUserUuid]);

  const filteredItems = useMemo(() => {
    if (mode !== 'COIN') return items;

    let list = [...items];
    if (coinFilter === 'IN_CART') {
      const cartIds = new Set(cart.map((c) => c.item.id));
      list = list.filter((i) => cartIds.has(i.id));
    }

    if (categoryFilter !== 'ALL') {
      list = list.filter((i) => i.category === categoryFilter);
    }

    return list;
  }, [mode, items, coinFilter, categoryFilter, cart]);

  const itemsPerPage = mode === 'COIN' ? COIN_ITEMS_PER_PAGE : POINT_ITEMS_PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const pagedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, page, itemsPerPage]);

  const totalPrice = useMemo(
    () => cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0),
    [cart],
  );

  const handleAddToCart = (item: ExchangeItem) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.item.id === item.id);
      if (exists) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleChangeQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((c) => c.item.id !== id));
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.item.id === id ? { ...c, quantity } : c)),
    );
  };

  const openFilter = () => {
    setDraftCoinFilter(coinFilter);
    setDraftCategoryFilter(categoryFilter);
    setDraftMinPrice(minPrice);
    setDraftMaxPrice(maxPrice);
    setIsFilterOpen(true);
  };

  const applyFilter = () => {
    setCoinFilter(draftCoinFilter);
    setCategoryFilter(draftCategoryFilter);
    setMinPrice(draftMinPrice);
    setMaxPrice(draftMaxPrice);
    setPage(1);
    setIsFilterOpen(false);
  };

  const handleSearch = () => {
    setKeyword(searchInput.trim());
    setPage(1);
  };

  const handleExchangeCart = async () => {
    try {
      for (const ci of cart) {
        await purchaseTradeItem(ci.item.id, ci.quantity);
      }
      alert('코인 교환이 완료되었습니다.');
      setCart([]);
      setIsConfirmOpen(false);
      setIsCartOpen(false);
      await Promise.all([loadItems(), loadBalance()]);
    } catch (err) {
      console.error(err);
      const message =
        err && typeof err === 'object' && 'response' in err
          ? ((err as { response?: { data?: { message?: string } } }).response?.data
              ?.message ?? '교환에 실패했습니다.')
          : '교환에 실패했습니다.';
      alert(message);
    }
  };

  const handleExchangePointItem = async (item: ExchangeItem) => {
    try {
      await purchaseTradeItem(item.id, 1);
      alert('포인트 교환이 완료되었습니다.');
      setSelectedPointItem(null);
      await Promise.all([loadItems(), loadBalance()]);
    } catch (err) {
      console.error(err);
      const message =
        err && typeof err === 'object' && 'response' in err
          ? ((err as { response?: { data?: { message?: string } } }).response?.data
              ?.message ?? '교환에 실패했습니다.')
          : '교환에 실패했습니다.';
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-[#E0E0E0]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMode('COIN');
              setPage(1);
            }}
            className={`px-4 py-2 text-sm font-semibold rounded-t ${
              mode === 'COIN'
                ? 'bg-black text-white'
                : 'bg-transparent text-black hover:bg-[#F5F5F5]'
            }`}
          >
            코인 거래소
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('POINT');
              setPage(1);
              setIsFilterOpen(false);
            }}
            className={`px-4 py-2 text-sm font-semibold rounded-t ${
              mode === 'POINT'
                ? 'bg-black text-white'
                : 'bg-transparent text-black hover:bg-[#F5F5F5]'
            }`}
          >
            포인트 거래소
          </button>
        </div>
      </div>

      <div
        className={`w-full ${mode === 'COIN' ? 'bg-[#FFC107]' : 'bg-[#7C4DFF]'} py-10`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">
            {mode === 'COIN' ? '코인 거래소' : '포인트 거래소'}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 relative">
        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 border border-[#E0E0E0] rounded px-3 py-2 text-sm outline-none"
              placeholder="아이템을 검색해보세요"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="px-3 py-2 text-sm rounded bg-black text-white"
            >
              검색
            </button>
          </div>

          {mode === 'COIN' ? (
            <div className="flex items-center gap-2 relative">
              <button
                type="button"
                className="px-3 py-2 text-left bg-[#F5F5F5] text-black rounded border border-[#E0E0E0] min-w-30"
              >
                <span className="block text-[10px] font-semibold text-[#616161]">보유 코인</span>
                <span className="block text-xs font-semibold tabular-nums leading-snug wrap-break-word">
                  {coinBalanceLine}
                </span>
              </button>
              <span className="text-sm font-semibold text-black">{filteredItems.length}개</span>
              <button
                type="button"
                onClick={openFilter}
                className="px-3 py-2 text-xs font-semibold bg-[#F5F5F5] text-black rounded border border-[#E0E0E0]"
              >
                필터
              </button>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="px-3 py-2 text-sm font-semibold bg-black text-white rounded"
              >
                장바구니
              </button>

              {isFilterOpen && (
                <div className="absolute right-24 top-10 w-64 bg-white border border-[#E0E0E0] rounded-lg shadow-lg text-[11px] p-3 space-y-3 z-10">
                  <div>
                    <p className="mb-1 font-semibold text-black">표시 범위</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDraftCoinFilter('ALL')}
                        className={`px-2 py-1 rounded border ${
                          draftCoinFilter === 'ALL'
                            ? 'bg-black text-white border-black'
                            : 'border-[#E0E0E0] text-black'
                        }`}
                      >
                        전체
                      </button>
                      <button
                        type="button"
                        onClick={() => setDraftCoinFilter('IN_CART')}
                        className={`px-2 py-1 rounded border ${
                          draftCoinFilter === 'IN_CART'
                            ? 'bg-black text-white border-black'
                            : 'border-[#E0E0E0] text-black'
                        }`}
                      >
                        장바구니만
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 font-semibold text-black">카테고리</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: 'ALL', label: '전체' },
                        { key: 'SNACK', label: '과자' },
                        { key: 'CANDY_CHOCOLATE', label: '캔디·초콜릿' },
                        { key: 'MEAL', label: '간편식' },
                        { key: 'DRINK', label: '음료' },
                      ].map(({ key, label }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setDraftCategoryFilter(key as CoinCategory)}
                          className={`px-2 py-1 rounded border ${
                            draftCategoryFilter === key
                              ? 'bg-black text-white border-black'
                              : 'border-[#E0E0E0] text-black'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 font-semibold text-black">가격 범위</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={draftMinPrice}
                        onChange={(e) => setDraftMinPrice(e.target.value)}
                        placeholder="최소"
                        className="w-20 px-2 py-1 border border-[#E0E0E0] rounded outline-none"
                      />
                      <span>~</span>
                      <input
                        type="number"
                        value={draftMaxPrice}
                        onChange={(e) => setDraftMaxPrice(e.target.value)}
                        placeholder="최대"
                        className="w-20 px-2 py-1 border border-[#E0E0E0] rounded outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={applyFilter}
                      className="px-3 py-1 rounded bg-black text-white font-semibold"
                    >
                      적용
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="px-4 py-2 text-left bg-[#F5F5F5] text-black rounded border border-[#E0E0E0] min-w-30"
            >
              <span className="block text-[10px] font-semibold text-[#616161]">보유 포인트</span>
              <span className="block text-xs font-semibold tabular-nums leading-snug wrap-break-word">
                {pointBalanceLine}
              </span>
            </button>
          )}
        </div>

        {loading ? (
          <section className="py-20 text-center text-[#757575] text-sm">
            불러오는 중...
          </section>
        ) : loadError ? (
          <section className="py-20 text-center text-red-500 text-sm">{loadError}</section>
        ) : mode === 'COIN' ? (
          <section className="grid grid-cols-5 gap-4 mb-10">
            {pagedItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setAddTarget(item)}
                className="aspect-square bg-[#EEEEEE] rounded-lg flex flex-col items-stretch justify-between hover:bg-[#E0E0E0] transition overflow-hidden"
              >
                <div className="flex-1 flex items-center justify-center bg-linear-to-br from-white to-[#F5F5F5]">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded shadow-inner"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded bg-[#D8D8D8] text-[10px] text-[#666] flex items-center justify-center">
                      NO IMAGE
                    </div>
                  )}
                </div>
                <div className="px-2 py-1 bg-white/90 border-t border-[#E0E0E0]">
                  <p className="text-[11px] font-semibold text-black truncate">{item.name}</p>
                  <p className="text-[10px] text-[#757575]">{item.price} 코인</p>
                </div>
              </button>
            ))}
          </section>
        ) : (
          <section className="space-y-8 mb-10">
            <div>
              <h2 className="text-sm font-semibold text-black mb-2">배너</h2>
              <div className="grid grid-cols-4 gap-4">
                {pagedItems.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedPointItem(item)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedPointItem(item)}
                    className="aspect-4/3 bg-[#EEEEEE] rounded-lg hover:bg-[#E0E0E0] transition flex flex-col justify-between overflow-hidden cursor-pointer"
                  >
                    <div className="flex-1 flex items-center justify-center bg-[#F5F5F5]">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded bg-[#D8D8D8] text-[10px] text-[#666] flex items-center justify-center">
                          NO IMAGE
                        </div>
                      )}
                    </div>
                    <div className="px-2 py-1 bg-white/90 border-t border-[#E0E0E0]">
                      <p className="text-[11px] font-semibold text-black truncate">{item.name}</p>
                      <p className="text-[10px] text-[#757575]">{item.price} 포인트</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-black mb-2">스티커</h2>
              <div className="grid grid-cols-5 gap-4">
                {pagedItems.slice(4).map((item) => (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedPointItem(item)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedPointItem(item)}
                    className="aspect-square bg-[#EEEEEE] rounded-lg hover:bg-[#E0E0E0] transition flex flex-col justify-between overflow-hidden cursor-pointer"
                  >
                    <div className="flex-1 flex items-center justify-center bg-[#F5F5F5]">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-[#D8D8D8] text-[9px] text-[#666] flex items-center justify-center">
                          NO
                        </div>
                      )}
                    </div>
                    <div className="px-1.5 py-0.5 bg-white/90 border-t border-[#E0E0E0]">
                      <p className="text-[10px] font-medium text-black truncate">{item.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="flex items-center justify-center gap-4 py-6 text-sm">
          <button type="button" onClick={() => setPage(1)} className="px-2">
            ≪
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-2"
          >
            ‹
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded text-xs font-medium ${
                  page === p ? 'bg-black text-white' : 'bg-[#F5F5F5] text-black'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-2"
          >
            ›
          </button>
          <button type="button" onClick={() => setPage(totalPages)} className="px-2">
            ≫
          </button>
        </div>
      </div>

      {mode === 'COIN' && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${
              isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            onClick={() => setIsCartOpen(false)}
          />
          <aside
            className={`fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-xl border-l border-[#E0E0E0] transform transition-transform duration-300 ${
              isCartOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-black">장바구니</h2>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="text-sm text-[#757575] hover:text-black"
                >
                  닫기
                </button>
              </div>
              {cart.length === 0 ? (
                <p className="text-sm text-[#9E9E9E]">담긴 아이템이 없습니다.</p>
              ) : (
                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  {cart.map((ci) => (
                    <div
                      key={ci.item.id}
                      className="flex items-center justify-between gap-2 border-b border-[#F0F0F0] pb-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-black truncate">{ci.item.name}</p>
                        <p className="text-xs text-[#757575]">
                          {ci.item.price} 코인 × {ci.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleChangeQuantity(ci.item.id, ci.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center border border-[#E0E0E0] rounded text-sm"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={ci.quantity}
                          onChange={(e) =>
                            handleChangeQuantity(ci.item.id, Number(e.target.value) || 1)
                          }
                          className="w-12 h-7 border border-[#E0E0E0] rounded text-center text-sm outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleChangeQuantity(ci.item.id, ci.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center border border-[#E0E0E0] rounded text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="pt-3 border-t border-[#E0E0E0] mt-2 text-sm">
                <p className="flex justify-between mb-2">
                  <span className="text-[#616161]">총 코인</span>
                  <span className="font-semibold text-black">{totalPrice} 코인</span>
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsConfirmOpen(true)}
                    disabled={cart.length === 0}
                    className="flex-1 px-3 py-2 text-xs rounded bg-black text-white font-semibold disabled:opacity-50"
                  >
                    교환하기
                  </button>
                  <button
                    type="button"
                    onClick={() => setCart([])}
                    className="px-3 py-2 text-xs border border-[#E0E0E0] rounded text-[#616161]"
                  >
                    비우기
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      {mode === 'COIN' && addTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAddTarget(null)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-[#E0E0E0] p-6">
            <h3 className="text-lg font-bold text-black mb-2">장바구니에 담을까요?</h3>
            <p className="text-sm text-[#616161] mb-4">
              <span className="font-semibold text-black">{addTarget.name}</span>을(를){' '}
              <span className="font-semibold text-black">{addTarget.price} 코인</span>으로
              추가합니다.
            </p>
            <div className="flex justify-end gap-2 text-sm">
              <button
                type="button"
                onClick={() => setAddTarget(null)}
                className="px-4 py-2 rounded border border-[#E0E0E0] text-[#616161]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddToCart(addTarget);
                  setAddTarget(null);
                  setIsCartOpen(true);
                }}
                className="px-4 py-2 rounded bg-black text-white font-semibold"
              >
                담기
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === 'COIN' && isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsConfirmOpen(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-[#E0E0E0] p-6">
            <h3 className="text-lg font-bold text-black mb-2">교환하시겠습니까?</h3>
            <p className="text-sm text-[#616161] mb-4">
              선택한 아이템을 총 <span className="font-semibold text-black">{totalPrice} 코인</span>
              으로 교환합니다.
            </p>
            <div className="flex justify-end gap-2 text-sm">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 rounded border border-[#E0E0E0] text-[#616161]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  void handleExchangeCart();
                }}
                className="px-4 py-2 rounded bg-black text-white font-semibold"
              >
                예, 교환할게요
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === 'POINT' && selectedPointItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedPointItem(null)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-[#E0E0E0] p-6">
            <h3 className="text-lg font-bold text-black mb-2">이 아이템을 교환할까요?</h3>
            <p className="text-sm text-[#616161] mb-4">
              <span className="font-semibold text-black">{selectedPointItem.name}</span>을(를){' '}
              <span className="font-semibold text-black">{selectedPointItem.price} 포인트</span>
              로 교환합니다.
            </p>
            <div className="flex justify-end gap-2 text-sm">
              <button
                type="button"
                onClick={() => setSelectedPointItem(null)}
                className="px-4 py-2 rounded border border-[#E0E0E0] text-[#616161]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  void handleExchangePointItem(selectedPointItem);
                }}
                className="px-4 py-2 rounded bg-black text-white font-semibold"
              >
                교환하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
