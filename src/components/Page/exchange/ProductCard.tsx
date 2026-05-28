import { ShoppingCart, Plus } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  stock?: number;
}

interface ProductCardProps {
  product: Product;
  isInCart: boolean;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, isInCart, onAddToCart }: ProductCardProps) => {
  const isSoldOut = product.stock !== undefined && product.stock === 0;
  const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 5;

  return (
    <div
      className={`bg-white rounded-xl border overflow-hidden transition-shadow group ${
        isSoldOut ? 'border-gray-100 opacity-60' : 'border-gray-200 hover:shadow-md'
      }`}
    >
      <div className="relative h-48 bg-gray-50 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`w-full h-full object-contain p-2 transition-all ${isSoldOut ? 'grayscale' : ''}`}
        />
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
              품절
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="text-sm font-medium text-gray-800 truncate mb-1">{product.name}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className={`text-sm font-bold ${isSoldOut ? 'text-gray-400' : 'text-[#e8d13a]'}`}>
                {product.price.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">코인</span>
            </div>
            {isLowStock && (
              <span className="text-[10px] text-orange-500 font-medium">
                잔여 {product.stock}개
              </span>
            )}
          </div>

          <button
            onClick={() => !isSoldOut && onAddToCart(product)}
            disabled={isSoldOut}
            className={`p-1.5 rounded-lg transition-colors ${
              isSoldOut
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : isInCart
                ? 'bg-[#e8d13a] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-[#e8d13a] hover:text-white'
            }`}
          >
            {isInCart && !isSoldOut ? <ShoppingCart size={14} /> : <Plus size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};
