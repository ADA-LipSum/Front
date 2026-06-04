import { useState, useEffect } from 'react';
import { searchExchanges } from '@/api/exchange';
import type { ExchangeSearchResponse } from '@/api/exchange';
import { ProductGrid } from './ProductGrid';
import { Pagination } from './Pagination';
import type { Product } from './ProductCard';

const ITEMS_PER_PAGE = 8;

interface StickerListProps {
  searchQuery?: string;
  cartProductIds: string[];
  onAddToCart: (product: Product) => void;
  currencyLabel?: string;
}

export const StickerList = ({
  searchQuery = '',
  cartProductIds,
  onAddToCart,
  currencyLabel,
}: StickerListProps) => {
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
          subCategory: 'STICKER',
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
        setError(err.message || '스티커 상품 불러오기 실패');
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
      {loading ? (
        <div className="flex justify-center items-center h-32 text-gray-400 text-sm">
          불러오는 중...
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-32 text-red-400 text-sm">{error}</div>
      ) : (
        <>
          <ProductGrid
            products={products}
            cartProductIds={cartProductIds}
            onAddToCart={onAddToCart}
            currencyLabel={currencyLabel}
          />
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
