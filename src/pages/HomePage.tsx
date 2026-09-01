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
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-700 px-8 py-16 text-white shadow-lg md:px-12 md:py-20">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative max-w-xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-indigo-100 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Fresh deals every day
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
            Shop the Best Deals Online
          </h1>
          <p className="mt-4 text-lg text-indigo-100">
            Discover thousands of products at prices you'll love. Fast shipping and easy returns.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="rounded-md bg-white px-6 py-3 font-semibold text-indigo-700 shadow-md transition-transform hover:scale-[1.02] hover:bg-indigo-50"
            >
              Shop Now
            </Link>
            <Link
              to="/cart"
              className="rounded-md border border-white/40 px-6 py-3 font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              View Cart
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
                className="group rounded-lg border border-gray-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-indigo-600">
                  {cat.name}
                </h3>
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
