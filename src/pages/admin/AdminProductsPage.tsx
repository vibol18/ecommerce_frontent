import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as productApi from '@/api/products'
import { getErrorMessage } from '@/api/client'
import { queryKeys } from '@/lib/queryKeys'
import { useProducts } from '@/features/products/hooks'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { Select } from '@/components/ui/Select'
import { formatCurrency } from '@/lib/utils'

export function AdminProductsPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<string>('all')
  const queryClient = useQueryClient()

  const { data, isLoading } = useProducts({
    page,
    per_page: 20,
    active_only: false,
    ...(status !== 'all' ? { status: status as 'active' | 'inactive' | 'out_of_stock' } : {}),
  })

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => productApi.deleteProduct(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() })
      toast.success('Product deleted')
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to delete product')),
  })

  const handleDelete = (slug: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(slug)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link to="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      <div className="mb-4 max-w-xs">
        <Select
          label="Filter by status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="out_of_stock">Out of stock</option>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data && data.data.length > 0 ? (
              data.data.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-100" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category?.name ?? '-'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/products/${product.slug}/edit`}
                        className="text-sm text-indigo-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.slug, product.name)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No products found.
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
    </div>
  )
}
