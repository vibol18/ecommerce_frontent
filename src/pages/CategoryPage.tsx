import { useParams, useSearchParams } from 'react-router-dom'
import { useProducts, useCategory } from '@/features/products/hooks'
import { ProductCard } from '@/components/ProductCard'
import { Pagination } from '@/components/ui/Pagination'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? '1')

  const { data: category, isLoading: categoryLoading } = useCategory(slug ?? '')
  const { data, isLoading } = useProducts(
    { category_id: category?.id, page, per_page: 12 },
    Boolean(category?.id),
  )

  const handlePageChange = (next: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(next))
    setSearchParams(params)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        {categoryLoading ? 'Category' : category?.name ?? 'Category'}
      </h1>
      {category?.description && (
        <p className="mt-1 text-gray-600">{category.description}</p>
      )}

      <div className="mt-6">
        {isLoading ? (
          <ProductGridSkeleton />
        ) : data && data.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
          <EmptyState title="No products in this category" />
        )}
      </div>
    </div>
  )
}
