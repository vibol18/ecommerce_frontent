import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import { useFeaturedProducts, useCategories } from '@/features/products/hooks'
import { ProductCard } from '@/components/ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

const promoCards = [
  {
    title: 'Free Shipping',
    description: 'On all orders over $50. No minimums, no code needed.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7h9v9H3zM12 13h5a3 3 0 013 3v1h-1M9 20a1.5 1.5 0 10 0-3 1.5 1.5 0 000 3zm9 0a1.5 1.5 0 10 0-3 1.5 1.5 0 000 3z"
        />
      </svg>
    ),
  },
  {
    title: 'Clearance Deals',
    description: 'Up to 40% off select clearance items while stocks last.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8L12 2z" />
      </svg>
    ),
  },
  {
    title: 'First Purchase',
    description: 'Get 15% off your first order with code NEW15.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const faqs = [
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping typically arrives within 3–5 business days. Express options are available at checkout.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 30-day return window on most items in original condition. See our Returns page for full details.',
  },
  {
    q: 'How do I track my order?',
    a: 'Once your order ships, a tracking link will be emailed to you. You can also view order status from your account.',
  },
  {
    q: 'Do you offer international shipping?',
    a: 'Yes, we ship to select countries worldwide. Shipping rates are calculated at checkout.',
  },
]

interface StaticBanner {
  id: string
  eyebrow: string
  title: string
  subtitle: string
  primary: { label: string; to: string }
  secondary: { label: string; to: string }
  icon: ReactNode
}

const staticBanners: StaticBanner[] = [
  {
    id: 'deal',
    eyebrow: 'Fresh deals every day',
    title: 'Shop the Best Deals Online',
    subtitle: "Discover thousands of products at prices you'll love. Fast shipping and easy returns.",
    primary: { label: 'Shop Now', to: '/products' },
    secondary: { label: 'View Cart', to: '/cart' },
    icon: (
      <svg className="h-16 w-16 md:h-24 md:w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 4.6a1 1 0 00.9 1.4h12.8M16 17h-6"
        />
      </svg>
    ),
  },
  {
    id: 'clearance',
    eyebrow: 'Limited time offer',
    title: 'Big Clearance Sale — Up to 40% Off',
    subtitle: 'Score unbeatable prices on clearance favorites while stocks last.',
    primary: { label: 'See Deals', to: '/products' },
    secondary: { label: 'Browse All', to: '/products' },
    icon: (
      <svg className="h-16 w-16 md:h-24 md:w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8L12 2z" />
      </svg>
    ),
  },
  {
    id: 'shipping',
    eyebrow: 'Fast & free',
    title: 'Free Shipping on Orders Over $50',
    subtitle: 'Enjoy free standard shipping and easy returns on every qualifying order.',
    primary: { label: 'Start Shopping', to: '/products' },
    secondary: { label: 'View Cart', to: '/cart' },
    icon: (
      <svg className="h-16 w-16 md:h-24 md:w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 7h9v9H3zM12 13h5a3 3 0 013 3v1h-1M9 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm9 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        />
      </svg>
    ),
  },
]

export function HomePage() {
  const featured = useFeaturedProducts()
  const allCategories = useCategories()
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const products = featured.data ?? []
  const useProductSlides = products.length > 0
  const hasMultiple = useProductSlides ? products.length > 1 : staticBanners.length > 1

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast.success('Thanks for subscribing!')
    ;(e.currentTarget.elements.namedItem('email') as HTMLInputElement).value = ''
  }

  return (
    <div className="space-y-12 md:space-y-16">
      <section className="hero-swiper-container relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-rose-600 shadow-lg">
        <Swiper
          className="hero-swiper"
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={700}
          loop={hasMultiple}
          autoplay={hasMultiple ? { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
          pagination={{ clickable: true, dynamicBullets: false }}
          slidesPerView={1}
          spaceBetween={0}
          touchRatio={1}
          grabCursor
          aria-label="Hero carousel"
        >
          {useProductSlides
            ? products.map((product) => (
                <SwiperSlide key={`product-${product.id}`} className="hero-swiper-slide !h-auto md:!h-full">
                  <div className="flex h-full min-h-[360px] flex-col px-8 py-12 text-white md:min-h-0 md:flex-row md:items-center md:gap-10 md:px-14 md:py-16">
                    <div
                      className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
                      aria-hidden="true"
                    />
                    <div
                      className="pointer-events-none absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-rose-400/20 blur-3xl"
                      aria-hidden="true"
                    />
                    <div className="relative flex-1">
                      {product.category && (
                        <p className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium uppercase tracking-wide backdrop-blur">
                          {product.category.name}
                        </p>
                      )}
                      <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">
                        {product.name}
                      </h1>
                      <p className="mt-4 line-clamp-2 max-w-md text-base text-orange-50 md:line-clamp-3 md:text-lg">
                        {product.description}
                      </p>
                      <div className="mt-4 flex flex-wrap items-baseline gap-3">
                        <span className="text-2xl font-bold text-white md:text-3xl">
                          {formatCurrency(product.price)}
                        </span>
                        {product.compare_price && product.compare_price > product.price && (
                          <span className="text-lg text-orange-200 line-through md:text-xl">
                            {formatCurrency(product.compare_price)}
                          </span>
                        )}
                      </div>
                      <div className="mt-7 flex flex-wrap gap-3">
                        <Link
                          to={`/products/${product.slug}`}
                          className="rounded-md bg-white px-6 py-3 font-semibold text-orange-700 shadow-md transition-transform hover:scale-[1.02] hover:bg-orange-50"
                        >
                          Shop Now
                        </Link>
                        <Link
                          to="/products"
                          className="rounded-md border border-white/40 px-6 py-3 font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
                        >
                          View All Products
                        </Link>
                      </div>
                    </div>
                    {product.images[0] && (
                      <div className="relative mt-8 shrink-0 md:mt-0 md:w-72">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-56 w-full rounded-xl border-4 border-white/30 object-cover shadow-2xl md:h-64"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))
            : staticBanners.map((banner) => (
                <SwiperSlide key={`banner-${banner.id}`} className="hero-swiper-slide !h-auto md:!h-full">
                  <div className="flex h-full min-h-[360px] flex-col px-8 py-12 text-white md:min-h-0 md:flex-row md:items-center md:gap-10 md:px-14 md:py-16">
                    <div
                      className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
                      aria-hidden="true"
                    />
                    <div
                      className="pointer-events-none absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-rose-400/20 blur-3xl"
                      aria-hidden="true"
                    />
                    <div className="relative flex-1">
                      <p className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur">
                        <span className="h-2 w-2 rounded-full bg-emerald-300" />
                        {banner.eyebrow}
                      </p>
                      <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">
                        {banner.title}
                      </h1>
                      <p className="mt-4 max-w-md text-base text-orange-50 md:text-lg">
                        {banner.subtitle}
                      </p>
                      <div className="mt-7 flex flex-wrap gap-3">
                        <Link
                          to={banner.primary.to}
                          className="rounded-md bg-white px-6 py-3 font-semibold text-orange-700 shadow-md transition-transform hover:scale-[1.02] hover:bg-orange-50"
                        >
                          {banner.primary.label}
                        </Link>
                        <Link
                          to={banner.secondary.to}
                          className="rounded-md border border-white/40 px-6 py-3 font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
                        >
                          {banner.secondary.label}
                        </Link>
                      </div>
                    </div>
                    <div className="relative mt-8 flex shrink-0 items-center justify-center md:mt-0 md:w-72 md:py-8">
                      <div className="flex h-40 w-40 items-center justify-center rounded-3xl border-4 border-white/30 bg-white/15 text-white backdrop-blur-md md:h-56 md:w-56">
                        {banner.icon}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <Link to="/products" className="text-sm font-medium text-orange-600 hover:text-orange-700">
            View all
          </Link>
        </div>
        {allCategories.isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        ) : allCategories.data && allCategories.data.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {allCategories.data.map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.slug}`}
                className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-orange-600">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="No categories yet" />
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {promoCards.map((card) => (
          <div
            key={card.title}
            className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              {card.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{card.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{card.description}</p>
            </div>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="mt-1 text-sm text-gray-500">Handpicked items you'll love this week</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
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

      <section>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
        <div className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-medium text-gray-900">{faq.q}</span>
                <svg
                  className={`h-5 w-5 shrink-0 text-orange-600 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && <p className="px-5 pb-4 text-sm text-gray-600">{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-gradient-to-r from-orange-600 to-rose-600 px-8 py-12 text-center text-white shadow-lg">
        <h2 className="text-2xl font-bold md:text-3xl">Stay in the loop</h2>
        <p className="mx-auto mt-2 max-w-md text-orange-50">
          Subscribe to get early access to sales and new arrivals straight to your inbox.
        </p>
        <form
          onSubmit={handleSubscribe}
          className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="w-full rounded-md border-0 px-4 py-3 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
          />
          <Button type="submit" className="bg-white !text-orange-700 hover:bg-orange-50" size="lg">
            Subscribe
          </Button>
        </form>
      </section>
    </div>
  )
}
