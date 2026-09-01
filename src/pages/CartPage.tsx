import { Link } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import type { CartItem } from '@/types'

export function CartPage() {
  const cart = useCart()

  if (cart.isLoading) {
    return <div className="text-center text-gray-500">Loading your cart...</div>
  }

  if (cart.items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Browse our products and add something you'll love."
        action={
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <div className="space-y-4">
          {cart.items.map((item) => (
            <CartRow key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div>
        <OrderSummary
          total={cart.total}
          count={cart.count}
          isLoggedIn={cart.isLoggedIn}
        />
        <button
          onClick={cart.clear}
          className="mt-4 w-full text-center text-sm text-red-600 hover:underline"
        >
          Clear cart
        </button>
      </div>
    </div>
  )
}

function CartRow({ item }: { item: CartItem }) {
  const cart = useCart()

  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
      <Link to={`/products/${item.product.slug}`} className="h-20 w-20 shrink-0">
        {item.product.images?.[0] ? (
          <img
            src={item.product.images[0]}
            alt={item.product.name}
            className="h-full w-full rounded-md object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-100 text-xs text-gray-400">
            No image
          </div>
        )}
      </Link>

      <div className="flex-1">
        <Link
          to={`/products/${item.product.slug}`}
          className="font-medium text-gray-900 hover:text-indigo-600"
        >
          {item.product.name}
        </Link>
        <p className="text-sm text-gray-500">{formatCurrency(item.product.price)}</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center rounded-md border border-gray-300">
            <button
              className="px-2 py-1 text-gray-600 hover:bg-gray-50"
              onClick={() => cart.update(item.id, item.quantity - 1)}
            >
              -
            </button>
            <span className="w-10 text-center text-sm">{item.quantity}</span>
            <button
              className="px-2 py-1 text-gray-600 hover:bg-gray-50"
              onClick={() => cart.update(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>
          <button
            onClick={() => cart.remove(item.id)}
            className="text-sm text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="text-right font-semibold text-gray-900">
        {formatCurrency(item.subtotal)}
      </div>
    </div>
  )
}

function OrderSummary({
  total,
  count,
  isLoggedIn,
}: {
  total: number
  count: number
  isLoggedIn: boolean
}) {
  const shipping = total >= 100 || total === 0 ? 0 : 10
  const grandTotal = total + shipping

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({count} items)</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
          <span>Total</span>
          <span>{formatCurrency(grandTotal)}</span>
        </div>
      </div>

      {isLoggedIn ? (
        <Link to="/checkout" className="mt-6 block">
          <Button className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </Link>
      ) : (
        <Link to="/checkout" className="mt-6 block">
          <Button className="w-full" size="lg">
            Checkout as Guest
          </Button>
        </Link>
      )}
      <p className="mt-2 text-center text-xs text-gray-500">
        {isLoggedIn ? (
          <>You'll review your order before placing it.</>
        ) : (
          <>
            <Link to="/login" className="text-indigo-600 hover:underline">
              Log in
            </Link>{' '}
            to save your cart.
          </>
        )}
      </p>
    </div>
  )
}
