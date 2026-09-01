import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMyOrders } from '@/features/orders/hooks'
import { Pagination } from '@/components/ui/Pagination'
import { formatCurrency, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/utils'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

export function OrdersPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useMyOrders(page)

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading orders...</div>
  }

  if (!data || data.data.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="When you place an order, it will show up here."
        action={
          <Link to="/products" className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
            Start Shopping
          </Link>
        }
      />
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Orders</h1>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Order
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.data.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {order.order_number}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                      ORDER_STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800',
                    )}
                  >
                    {ORDER_STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/account/orders/${order.id}`}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={data.current_page} lastPage={data.last_page} onPageChange={setPage} />
    </div>
  )
}
