import { useParams, Link } from 'react-router-dom'
import { useOrder } from '@/features/orders/hooks'
import { formatCurrency, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/utils'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading } = useOrder(Number(id))

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading order...</div>
  }

  if (!order) {
    return <EmptyState title="Order not found" />
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Order {order.order_number}</h1>
        <span
          className={cn(
            'inline-flex rounded-full px-3 py-1 text-sm font-medium',
            ORDER_STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800',
          )}
        >
          {ORDER_STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="font-semibold text-gray-900">Items</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-gray-900">{item.product_name}</p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(item.price)} × {item.quantity}
                </p>
              </div>
              <span className="font-medium text-gray-900">{formatCurrency(item.total)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Subtotal</dt>
            <dd className="font-medium text-gray-900">{formatCurrency(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Shipping</dt>
            <dd className="font-medium text-gray-900">{formatCurrency(order.shipping_cost)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Tax</dt>
            <dd className="font-medium text-gray-900">{formatCurrency(order.tax)}</dd>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
            <dt className="font-semibold text-gray-900">Total</dt>
            <dd className="font-bold text-gray-900">{formatCurrency(order.total)}</dd>
          </div>
        </dl>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray-500">Shipping address</dt>
            <dd className="mt-1 text-gray-900">
              {order.shipping_address ?? 'N/A'}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Payment method</dt>
            <dd className="mt-1 capitalize text-gray-900">
              {order.payment?.method ?? 'N/A'}
            </dd>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link to="/account/orders" className="text-sm text-indigo-600 hover:underline">
          ← Back to orders
        </Link>
      </div>
    </div>
  )
}
