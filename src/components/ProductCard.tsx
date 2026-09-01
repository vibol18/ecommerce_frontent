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
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative h-48 w-full bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            No image
          </div>
        )}
        {product.compare_price && product.compare_price > product.price && (
          <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
            Sale
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-sm font-medium text-gray-900">{product.name}</h3>
        {product.category && (
          <p className="mt-0.5 text-xs text-gray-500">{product.category.name}</p>
        )}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-indigo-600">
            {formatCurrency(product.price)}
          </span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(product.compare_price)}
            </span>
          )}
        </div>
        {product.average_rating !== undefined && (
          <div className="mt-1 text-xs text-amber-500">
            {'★'.repeat(Math.round(product.average_rating))}
            <span className="text-gray-400"> ({product.reviews_count ?? 0})</span>
          </div>
        )}
        {product.stock === 0 ? (
          <Button disabled size="sm" className="mt-3">
            Out of stock
          </Button>
        ) : (
          <Button
            size="sm"
            className="mt-3"
            onClick={handleAdd}
            variant="secondary"
          >
            Add to Cart
          </Button>
        )}
      </div>
    </Link>
  )
}
