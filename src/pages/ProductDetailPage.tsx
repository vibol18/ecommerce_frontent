import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useProduct } from '@/features/products/hooks'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/lib/utils'
import { Button, Spinner } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuthStore } from '@/store/auth'
import type { Product } from '@/types'
import toast from 'react-hot-toast'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, isLoading } = useProduct(slug ?? '')
  const cart = useCart()
  const user = useAuthStore((s) => s.user)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Skeleton className="h-96 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
    )
  }

  if (!product) {
    return <EmptyState title="Product not found" />
  }

  const images = product.images.length > 0 ? product.images : ['']

  const handleAdd = () => {
    if (product.stock === 0) return
    if (cart.isLoggedIn) {
      cart.addProduct(product, quantity)
    } else {
      cart.addProduct(product, quantity)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
      <div className="space-y-4">
        <div className="aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
          <img
            src={images[activeImage] || undefined}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        {images.length > 1 && (
          <div className="flex gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`h-20 w-20 overflow-hidden rounded-md border-2 ${
                  i === activeImage ? 'border-indigo-600' : 'border-gray-200'
                }`}
              >
                <img src={img || undefined} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <Link
          to={product.category ? `/categories/${product.category.slug}` : '/products'}
          className="text-sm text-indigo-600 hover:underline"
        >
          {product.category?.name ?? 'Uncategorized'}
        </Link>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">{product.name}</h1>

        {product.average_rating !== undefined && (
          <div className="mt-2 text-sm text-amber-500">
            {'★'.repeat(Math.round(product.average_rating))}
            <span className="ml-1 text-gray-500">
              ({product.reviews_count ?? 0} reviews)
            </span>
          </div>
        )}

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-bold text-indigo-600">
            {formatCurrency(product.price)}
          </span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="text-xl text-gray-400 line-through">
              {formatCurrency(product.compare_price)}
            </span>
          )}
        </div>

        <p className="mt-4 text-gray-600">{product.description}</p>

        <div className="mt-4">
          {product.stock > 0 ? (
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              In stock ({product.stock} available)
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
              Out of stock
            </span>
          )}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center rounded-md border border-gray-300">
            <button
              className="px-3 py-2 text-gray-600 hover:bg-gray-50"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </button>
            <span className="w-12 text-center">{quantity}</span>
            <button
              className="px-3 py-2 text-gray-600 hover:bg-gray-50"
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>
          <Button size="lg" onClick={handleAdd} disabled={product.stock === 0}>
            {cart.isLoading ? <Spinner className="h-5 w-5" /> : 'Add to Cart'}
          </Button>
        </div>

        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          <p className="font-medium text-gray-900">Note</p>
          {user ? (
            <p>You are signed in as {user.email}. Your cart will sync to your account.</p>
          ) : (
            <p>
              <Link to="/login" className="text-indigo-600 hover:underline">
                Sign in
              </Link>{' '}
              to sync your cart across devices.
            </p>
          )}
        </div>
      </div>

      <Reviews product={product} />
    </div>
  )
}

function Reviews({ product }: { product: Product }) {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const submitReview = async () => {
    if (!user) return
    const { createReview } = await import('@/api/products')
    try {
      await createReview(product.slug, { rating, comment })
      toast.success('Review submitted')
      setComment('')
      queryClient.invalidateQueries({ queryKey: ['products', 'detail', product.slug] })
    } catch {
      toast.error('Failed to submit review')
    }
  }

  return (
    <div className="md:col-span-2">
      <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
      {product.reviews && product.reviews.length > 0 ? (
        <div className="mt-4 space-y-4">
          {product.reviews.map((review) => (
            <div key={review.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{review.user.name}</p>
                  <span className="text-sm text-amber-500">
                    {'★'.repeat(review.rating)}
                    <span className="text-gray-300">{'★'.repeat(5 - review.rating)}</span>
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
                </span>
              </div>
              {review.comment && <p className="mt-2 text-sm text-gray-600">{review.comment}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-500">No reviews yet.</p>
      )}

      {user ? (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-lg font-medium text-gray-900">Write a review</h3>
          <div className="mt-3">
            <label className="mb-1 block text-sm font-medium text-gray-700">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  onClick={() => setRating(r)}
                  className={`text-2xl ${r <= rating ? 'text-amber-500' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience (optional)"
            className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            rows={3}
          />
          <Button className="mt-3" onClick={submitReview}>
            Submit Review
          </Button>
        </div>
      ) : (
        <p className="mt-6 text-sm text-gray-500">
          <Link to="/login" className="text-indigo-600 hover:underline">
            Log in
          </Link>{' '}
          to write a review.
        </p>
      )}
    </div>
  )
}
