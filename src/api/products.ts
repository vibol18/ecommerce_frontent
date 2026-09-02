import { api, unwrap } from './client'
import type { Category, Paginated, Product, ProductFilters, Review } from '@/types'

export async function getProducts(filters: ProductFilters = {}): Promise<Paginated<Product>> {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      params.set(key, String(value))
    }
  })
  const res = await api.get('/products', { params })
  return unwrap<Paginated<Product>>(res)
}

export async function getProduct(slug: string): Promise<Product> {
  const res = await api.get(`/products/${slug}`)
  return unwrap<Product>(res)
}

export async function getAdminProduct(slug: string): Promise<Product> {
  const res = await api.get(`/products/${slug}`)
  return unwrap<Product>(res)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const res = await api.get('/products', { params: { is_featured: 1, per_page: 8 } })
  return res.data.data as Product[]
}

export async function createProduct(
  data: Partial<Product>,
): Promise<Product> {
  const res = await api.post('/products', data)
  return unwrap<Product>(res)
}

export async function updateProduct(
  slug: string,
  data: Partial<Product>,
): Promise<Product> {
  const res = await api.put(`/products/${slug}`, data)
  return unwrap<Product>(res)
}

export async function deleteProduct(slug: string): Promise<void> {
  await api.delete(`/products/${slug}`)
}

export async function getCategories(): Promise<Category[]> {
  const res = await api.get('/categories')
  return res.data.data as Category[]
}

export async function getCategory(slug: string): Promise<Category> {
  const res = await api.get(`/categories/${slug}`)
  return unwrap<Category>(res)
}

export async function createCategory(data: Partial<Category>): Promise<Category> {
  const res = await api.post('/categories', data)
  return unwrap<Category>(res)
}

export async function updateCategory(slug: string, data: Partial<Category>): Promise<Category> {
  const res = await api.put(`/categories/${slug}`, data)
  return unwrap<Category>(res)
}

export async function deleteCategory(slug: string): Promise<void> {
  await api.delete(`/categories/${slug}`)
}

export async function getProductReviews(slug: string): Promise<Review[]> {
  const res = await api.get(`/products/${slug}/reviews`)
  return unwrap<Review[]>(res)
}

export async function createReview(
  slug: string,
  data: { rating: number; title?: string; comment?: string },
): Promise<Review> {
  const res = await api.post(`/products/${slug}/reviews`, data)
  return unwrap<Review>(res)
}
