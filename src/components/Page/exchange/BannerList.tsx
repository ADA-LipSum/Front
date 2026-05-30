import { useState, useEffect } from 'react';
import { searchExchanges } from '@/api/exchange';
import type { ExchangeSearchResponse } from '@/api/exchange';
import { BannerCard } from './BannerCard';
import { Pagination } from './Pagination';
import type { Product } from './ProductCard';

const ITEMS_PER_PAGE = 12;

interface BannerListProps {
  searchQuery?: string;
  cartProductIds: string[];
  onAddToCart: (product: Product) => void;
  currencyLabel?: string;
}

export const BannerList = ({
  searchQuery = '',
  cartProductIds,
  onAddToCart,
  currencyLabel,
}: BannerListProps) => {
  const [items, setItems] = useState<ExchangeSearchResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await searchExchanges({
          category: 'ETC',
          subCategory: 'BANNER',
          keyword: searchQuery || undefined,
          active: true,
          page: currentPage - 1,
          size: ITEMS_PER_PAGE,
          sort: 'createdAt',
          dir: 'desc',
        });
        setItems(result.content);
        setTotalPages(result.totalPages);
      } catch (err: any) {
        setError(err.message || '배너 상품 불러오기 실패');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [searchQuery, currentPage]);

  const products: Product[] = items.map((item) => ({
    id: item.itemUuid,
    name: item.name,
    price: item.price,
    imageUrl: item.imageUrl,
    category: item.category,
    stock: item.stock,
  }));

  return (
    <section>
      <h2 className="text-base font-semibold text-gray-700 mb-3">배너</h2>
      {loading ? (
        <div className="flex justify-center items-center h-32 text-gray-400 text-sm">
          불러오는 중...
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-32 text-red-400 text-sm">{error}</div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <p className="text-sm">
                상품이 없습니다. 관리자 또는 선생님께 문의하여 원하는 상품을 추가할 수 있어요!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {products.map((product) => (
                <BannerCard
                  key={product.id}
                  product={product}
                  isInCart={cartProductIds.includes(product.id)}
                  onAddToCart={onAddToCart}
                  currencyLabel={currencyLabel}
                />
              ))}
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </section>
  );
};
