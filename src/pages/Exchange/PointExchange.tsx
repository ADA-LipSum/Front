import { useState, useMemo, useEffect } from 'react';
import { SearchBar } from '@/components/Page/exchange/SearchBar';
import { CategoryFilter } from '@/components/Page/exchange/CategoryFilter';
import { ProductGrid } from '@/components/Page/exchange/ProductGrid';
import { Pagination } from '@/components/Page/exchange/Pagination';
import { ExchangeNav } from '@/components/Page/exchange/ExchangeNav';
import { Cart } from '@/components/Page/exchange/Cart';
import type { CartItem } from '@/components/Page/exchange/Cart';
import type { Product } from '@/components/Page/exchange/ProductCard';
import { PointLeft } from '@/components/Page/exchange/PointLeft';
import { PointInfo } from '@/components/Page/exchange/PointInfo';
import type { PaymentRecord } from '@/components/Page/exchange/CoinInfo';
import { useAuthStore } from '@/store/authStore';
import { usePointStore } from '@/store/pointStore';

const ITEMS_PER_PAGE = 12;

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: '허니버터칩 오리지날',
    price: 150,
    imageUrl:
      'https://i.namu.wiki/i/O07CHBNvNR3u6xduA-PeT22BUQsH5zCyKblrg0lzS-Q_cnp4qisGHiaqHDLYRV5vaYZxZzIZhfqn_YvfN8_pkQ.webp',
    category: '과자',
  },
  {
    id: '2',
    name: '포카칩 오리지날',
    price: 120,
    imageUrl:
      'https://i.namu.wiki/i/1xpHfMVtPVhBnkTV5eZOdqtLiafYS93RhGKcavsc8shwJmgkv2rcmpg2D6X42pOEzb3B8rT3Rkr97Gcc6GMvUA.webp',
    category: '과자',
  },
  {
    id: '3',
    name: '꼬깔콘 군옥수수맛',
    price: 100,
    imageUrl:
      'https://marketvan.ca/cdn/shop/files/86f266a61c2bde54ee09527e54b0ed38.png?v=1740699226&width=600',
    category: '과자',
  },
  {
    id: '4',
    name: '새우깡 오리지날',
    price: 110,
    imageUrl:
      'https://m.nongshimmall.com/web/product/big/202510/6c97b7e0a351917cdd8533e3d46e2494.jpg',
    category: '과자',
  },
];

const EARN_TYPES = ['EARN', 'REWARD', 'ATTEND', 'ATTENDANCE', 'EVENT', 'BONUS'];

const toPaymentRecord = (tx: Record<string, any>): PaymentRecord => {
  const changeType: string = tx.changeType ?? tx.type ?? '';
  const isEarn = EARN_TYPES.some((t) => changeType.toUpperCase().includes(t));
  const amount: number = Math.abs(tx.points ?? tx.amount ?? 0);
  const source: string = tx.description ?? changeType;
  const rawDate: string = tx.createdAt ?? tx.date ?? '';
  const dateStr = rawDate.length >= 10 ? rawDate.slice(5, 10).replace('-', '.') : rawDate;
  return {
    id: String(tx.pointsUUid ?? tx.id ?? Math.random()),
    type: isEarn ? '획득' : '사용',
    amount,
    source,
    date: dateStr,
  };
};

export const PointExchange = () => {
  const userUuid = useAuthStore((s) => s.user?.uuid);
  const { balance, transactions, fetchBalance, fetchTransactions } = usePointStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!userUuid) return;
    fetchBalance(userUuid);
    fetchTransactions(userUuid);
  }, [userUuid]);

  const history = useMemo<PaymentRecord[]>(() => transactions.map(toPaymentRecord), [transactions]);

  const cartProductIds = useMemo(() => cartItems.map((item) => item.product.id), [cartItems]);

  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS;
    if (selectedCategory !== '전체') {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      result = result.filter((p) => p.name.includes(searchQuery.trim()));
    }
    return result;
  }, [selectedCategory, searchQuery, cartProductIds]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const pagedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      if (prev.find((item) => item.product.id === product.id)) return prev;
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemove = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-[#E0E0E0] w-full py-20 bg-purple-500"></div>

      <div className="flex gap-6 px-5 py-6 max-w-7xl mx-auto">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <SearchBar value={searchQuery} onChange={handleSearchChange} />
            </div>
          </div>
          <CategoryFilter selected={selectedCategory} onChange={handleCategoryChange} />
          <ProductGrid
            products={pagedProducts}
            cartProductIds={cartProductIds}
            onAddToCart={handleAddToCart}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <div className="w-72 shrink-0 flex flex-col gap-4">
          <PointLeft balance={balance} />
          <ExchangeNav />
          <PointInfo history={history} />
          <Cart
            items={cartItems}
            coinBalance={balance}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
            onPurchase={() => setCartItems([])}
          />
        </div>
      </div>
    </div>
  );
};
