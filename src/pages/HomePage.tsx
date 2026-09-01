import { Link } from 'react-router-dom'
import { useFeaturedProducts, useCategories } from '@/features/products/hooks'
import { ProductCard } from '@/components/ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'

export function HomePage() {
  const featured = useFeaturedProducts()
  const categories = useCategories()

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-16 text-white">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold md:text-5xl">Shop the Best Deals Online</h1>
          <p className="mt-4 text-lg text-indigo-100">
            Discover thousands of products at prices you'll love. Fast shipping and easy returns.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/products"
              className="rounded-md bg-white px-5 py-2.5 font-medium text-indigo-700 hover:bg-indigo-50"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
        </div>
        {categories.isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        ) : categories.data && categories.data.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.data.map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.slug}`}
                className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-shadow hover:shadow-md"
              >
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="No categories yet" />
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            View all
          </Link>
        </div>
        {featured.isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : featured.data && featured.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState title="No featured products" />
        )}
      </section>
    </div>
  )
}
