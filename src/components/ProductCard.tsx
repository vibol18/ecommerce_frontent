import { Link } from 'react-router-dom'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'

export function ProductCard({ product }: { product: Product }) {
  const cart = useCart()
  const image = product.images?.[0]

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    cart.add(product.id, 1)
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-square w-full bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            No image
          </div>
        )}
        {product.compare_price && product.compare_price > product.price && (
          <span className="absolute left-2 top-2 rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% off
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-sm font-medium text-gray-900 transition-colors group-hover:text-indigo-600">
          {product.name}
        </h3>
        {product.category && (
          <p className="mt-0.5 text-xs text-gray-500">{product.category.name}</p>
        )}
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-indigo-600">
              {formatCurrency(product.price)}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(product.compare_price)}
              </span>
            )}
          </div>
          {product.average_rating !== undefined && (
            <div className="mt-1.5 flex items-center gap-1 text-xs">
              <span className="text-amber-500">
                {'★'.repeat(Math.round(product.average_rating))}
                {'☆'.repeat(5 - Math.round(product.average_rating))}
              </span>
              <span className="text-gray-500">({product.reviews_count ?? 0})</span>
            </div>
          )}
          {product.stock === 0 ? (
            <Button disabled size="sm" className="mt-3 w-full">
              Out of stock
            </Button>
          ) : (
            <Button
              size="sm"
              className="mt-3 w-full"
              onClick={handleAdd}
              variant="secondary"
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </Link>
  )
}
