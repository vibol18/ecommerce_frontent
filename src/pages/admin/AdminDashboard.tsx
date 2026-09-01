import { Link } from 'react-router-dom'
import { useAdminStats } from '@/features/orders/hooks'
import { formatCurrency } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'

function StatCard({ label, value, currency }: { label: string; value?: number; currency?: boolean }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">{label}</p>
      {value === undefined ? (
        <Skeleton className="mt-2 h-8 w-24" />
      ) : (
        <p className="mt-1 text-2xl font-bold text-gray-900">
          {currency ? formatCurrency(value) : value.toLocaleString()}
        </p>
      )}
    </div>
  )
}

export function AdminDashboard() {
  const { data, isLoading } = useAdminStats()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Sales" value={data?.total_sales} currency />
        <StatCard label="Total Orders" value={data?.total_orders} />
        <StatCard label="Total Products" value={data?.total_products} />
        <StatCard label="Total Customers" value={data?.total_customers} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Low Stock</h2>
          {isLoading ? (
            <div className="mt-3 space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : data && data.low_stock_products.length > 0 ? (
            <ul className="mt-3 divide-y divide-gray-200">
              {data.low_stock_products.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="font-medium text-red-600">{item.stock} left</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-500">All products are well stocked.</p>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-indigo-600 hover:underline">
              View all
            </Link>
          </div>
          {isLoading ? (
            <div className="mt-3 space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : data && data.recent_orders.length > 0 ? (
            <ul className="mt-3 divide-y divide-gray-200">
              {data.recent_orders.map((order) => (
                <li key={order.id} className="flex items-center justify-between py-2 text-sm">
                  <Link to="/admin/orders" className="text-indigo-600 hover:underline">
                    {order.order_number}
                  </Link>
                  <span className="text-gray-600">{formatCurrency(order.total)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-500">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
