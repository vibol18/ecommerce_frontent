import { useQuery } from '@tanstack/react-query'
import * as productApi from '@/api/products'
import { queryKeys } from '@/lib/queryKeys'
import type { ProductFilters } from '@/types'

export function useProducts(filters: ProductFilters, enabled = true) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productApi.getProducts(filters),
    placeholderData: (prev) => prev,
    enabled,
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => productApi.getProduct(slug),
    enabled: Boolean(slug),
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: queryKeys.products.featured(),
    queryFn: productApi.getFeaturedProducts,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: productApi.getCategories,
  })
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(slug),
    queryFn: () => productApi.getCategory(slug),
    enabled: Boolean(slug),
  })
}
