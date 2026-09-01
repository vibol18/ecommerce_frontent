import { useQuery } from '@tanstack/react-query'
import * as ordersApi from '@/api/orders'
import { queryKeys } from '@/lib/queryKeys'

export function useMyOrders(page: number) {
  return useQuery({
    queryKey: queryKeys.orders.mine(page),
    queryFn: () => ordersApi.getOrders(),
  })
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => ordersApi.getOrder(id),
    enabled: Boolean(id),
  })
}

export function useAdminOrders(filters: { page?: number; status?: string; search?: string }) {
  return useQuery({
    queryKey: queryKeys.orders.admin(filters),
    queryFn: () => ordersApi.getAdminOrders(filters),
  })
}

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.admin.stats(),
    queryFn: () => import('@/api/admin').then((m) => m.getAdminStats()),
  })
}
