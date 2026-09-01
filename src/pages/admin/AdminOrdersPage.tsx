import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as ordersApi from '@/api/orders'
import { getErrorMessage } from '@/api/client'
import { queryKeys } from '@/lib/queryKeys'
import { useAdminOrders } from '@/features/orders/hooks'
import { Pagination } from '@/components/ui/Pagination'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { formatCurrency, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types'

const STATUSES: OrderStatus[] = ['pending', 'paid', 'shipped', 'completed', 'cancelled']

export function AdminOrdersPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useAdminOrders({ page, status, search })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      ordersApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() })
      toast.success('Order status updated')
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update order status')),
  })

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setPage(1)
      setSearch((e.target as HTMLInputElement).value)
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Orders</h1>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-[200px_1fr]">
        <Select
          label="Filter by status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
        >
          <option value="all">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
        <Input
          label="Search order # or customer"
          placeholder="Type and press Enter"
          defaultValue={search}
          onKeyDown={handleSearch}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Order
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Customer
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
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data && data.data.length > 0 ? (
              data.data.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {order.order_number}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.user?.name ?? 'Customer'}</td>
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
                    <div className="flex items-center gap-2">
                      <Select
                        value={order.status}
                        onChange={(e) =>
                          statusMutation.mutate({
                            id: order.id,
                            status: e.target.value as OrderStatus,
                          })
                        }
                        className="w-32"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {ORDER_STATUS_LABELS[s]}
                          </option>
                        ))}
                      </Select>
                      <Link
                        to={`/account/orders/${order.id}`}
                        className="text-sm whitespace-nowrap text-indigo-600 hover:underline"
                      >
                        Details
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data && (
        <Pagination
          currentPage={data.current_page}
          lastPage={data.last_page}
          onPageChange={setPage}
        />
      )}

      <div className="mt-6">
        <Link to="/admin" className="text-sm text-indigo-600 hover:underline">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  )
}