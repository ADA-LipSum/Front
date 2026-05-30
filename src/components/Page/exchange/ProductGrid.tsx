import { type Product, ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  cartProductIds: string[];
  onAddToCart: (product: Product) => void;
  currencyLabel?: string;
}

export const ProductGrid = ({ products, cartProductIds, onAddToCart, currencyLabel }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-sm">
          상품이 없습니다. 관리자 또는 선생님께 문의하여 원하는 상품을 추가할 수 있어요!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isInCart={cartProductIds.includes(product.id)}
          onAddToCart={onAddToCart}
          currencyLabel={currencyLabel}
        />
      ))}
    </div>
  );
};
