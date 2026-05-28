import { useState, useMemo, useEffect } from 'react';
import { SearchBar } from '@/components/Page/exchange/SearchBar';
import { CategoryFilter } from '@/components/Page/exchange/CategoryFilter';
import { ProductGrid } from '@/components/Page/exchange/ProductGrid';
import { Pagination } from '@/components/Page/exchange/Pagination';
import { ExchangeNav } from '@/components/Page/exchange/ExchangeNav';
import { CoinInfo } from '@/components/Page/exchange/CoinInfo';
import { Cart } from '@/components/Page/exchange/Cart';
import type { CartItem } from '@/components/Page/exchange/Cart';
import type { Product } from '@/components/Page/exchange/ProductCard';
import { CoinLeft } from '@/components/Page/exchange/CoinLeft';
import { useAuthStore } from '@/store/authStore';
import { useCoinStore } from '@/store/coinStore';
import { useExchangeStore } from '@/store/exchangeStore';
import type { ExchangeSubCategory } from '@/api/exchange';

const ITEMS_PER_PAGE = 12;

const FOOD_CATEGORIES = ['전체', '과자', '캔디', '음료', '간편식'];

const SUBCATEGORY_MAP: Record<string, ExchangeSubCategory> = {
  과자: 'SNACK',
  캔디: 'CANDY',
  음료: 'JUICE',
  간편식: 'INSTANT',
};

export const CoinExchange = () => {
  const userUuid = useAuthStore((s) => s.user?.uuid);
  const {
    balance,
    purchases,
    fetchBalance,
    fetchPurchases,
    fetchCart,
    cartItems: serverCartItems,
    cartLoading,
    cartError,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    checkout,
  } = useCoinStore();
  const { items, totalPages, loading, error, search } = useExchangeStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!userUuid) return;
    fetchBalance(userUuid);
    fetchPurchases(userUuid);
    fetchCart();
  }, [userUuid]);

  useEffect(() => {
    search({
      keyword: searchQuery || undefined,
      category: 'FOOD',
      subCategory: selectedCategory !== '전체' ? SUBCATEGORY_MAP[selectedCategory] : undefined,
      sort: 'createdAt',
      dir: 'desc',
      active: true,
      page: currentPage - 1,
      size: ITEMS_PER_PAGE,
    });
  }, [searchQuery, selectedCategory, currentPage, search]);

  const pagedProducts = useMemo<Product[]>(
    () =>
      items.map((item) => ({
        id: item.itemUuid,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        category: item.category,
        stock: item.stock,
      })),
    [items],
  );

  const cartData = useMemo<CartItem[]>(
    () =>
      serverCartItems.map((item) => ({
        cartItemUuid: item.cartItemUuid,
        product: {
          id: item.itemUuid,
          name: item.itemName,
          price: item.unitPrice,
          imageUrl: item.imageUrl,
          category: '',
        },
        quantity: item.quantity,
      })),
    [serverCartItems],
  );

  const cartProductIds = useMemo(
    () => serverCartItems.map((item) => item.itemUuid),
    [serverCartItems],
  );

  const handleAddToCart = (product: Product) => {
    if (product.stock !== undefined && product.stock === 0) return;
    const alreadyInCart = serverCartItems.some((item) => item.itemUuid === product.id);
    if (alreadyInCart) return;
    addToCart(product.id, 1);
  };

  const handleQuantityChange = (cartItemUuid: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemUuid);
    } else {
      updateCartQuantity(cartItemUuid, newQuantity);
    }
  };

  const handleRemove = (cartItemUuid: string) => {
    removeFromCart(cartItemUuid);
  };

  const handlePurchase = async () => {
    const success = await checkout();
    if (success && userUuid) {
      fetchPurchases(userUuid);
    }
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
    <div className="bg-white min-h-screen ">
      <div className="border-b border-[#E0E0E0] w-full py-20 bg-amber-300"></div>

      <div className="flex gap-6 px-5 py-6 max-w-7xl mx-auto">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <SearchBar value={searchQuery} onChange={handleSearchChange} />
            </div>
          </div>
          <CategoryFilter
            selected={selectedCategory}
            onChange={handleCategoryChange}
            categories={FOOD_CATEGORIES}
          />
          {loading ? (
            <div className="flex justify-center items-center h-48 text-gray-400 text-sm">
              불러오는 중...
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-48 text-red-400 text-sm">
              {error}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        <div className="w-72 shrink-0 flex flex-col gap-4">
          <CoinLeft balance={balance} />
          <ExchangeNav />
          <Cart
            items={cartData}
            coinBalance={balance}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
            onPurchase={handlePurchase}
            purchasing={cartLoading}
            error={cartError}
          />
          <CoinInfo history={purchases} />
        </div>
      </div>
    </div>
  );
};
