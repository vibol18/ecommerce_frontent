import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '@/features/products/hooks'
import { ProductCard } from '@/components/ProductCard'
import { ProductFilters } from '@/components/ProductFilters'
import { Pagination } from '@/components/ui/Pagination'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { useDebounce } from '@/hooks/useDebounce'
import type { ProductFilters as Filters } from '@/types'

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? '1')

  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get('search') ?? undefined,
    category_id: searchParams.get('category_id') ? Number(searchParams.get('category_id')) : undefined,
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    sort_by: (searchParams.get('sort_by') as Filters['sort_by']) ?? undefined,
    sort_direction: (searchParams.get('sort_direction') as Filters['sort_direction']) ?? undefined,
  })

  const debouncedSearch = useDebounce(filters.search, 400)

  const queryFilters: Filters = {
    ...filters,
    search: debouncedSearch,
    page,
    per_page: 12,
  }

  const { data, isLoading, isFetching } = useProducts(queryFilters)

  const applyFilters = (newFilters: Filters) => {
    const params = new URLSearchParams()
    if (newFilters.search) params.set('search', newFilters.search)
    if (newFilters.category_id) params.set('category_id', String(newFilters.category_id))
    if (newFilters.min_price) params.set('min_price', String(newFilters.min_price))
    if (newFilters.max_price) params.set('max_price', String(newFilters.max_price))
    if (newFilters.sort_by) params.set('sort_by', newFilters.sort_by)
    if (newFilters.sort_direction) params.set('sort_direction', newFilters.sort_direction)
    setSearchParams(params)
    setFilters(newFilters)
  }

  const handlePageChange = (next: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(next))
    setSearchParams(params)
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
      <aside>
        <ProductFilters filters={filters} onApply={applyFilters} />
      </aside>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          {data && <span className="text-sm text-gray-500">{data.total} items</span>}
        </div>

        {isLoading ? (
          <ProductGridSkeleton />
        ) : data && data.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination
              currentPage={data.current_page}
              lastPage={data.last_page}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <EmptyState
            title="No products found"
            description="Try adjusting your filters or search query."
          />
        )}
        {isFetching && !isLoading && (
          <p className="mt-4 text-center text-sm text-gray-400">Refreshing...</p>
        )}
      </div>
    </div>
  )
}