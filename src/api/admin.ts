import { api, unwrap } from './client'
import type { Order, Product } from '@/types'

export interface AdminStats {
  total_sales: number
  total_orders: number
  total_products: number
  total_customers: number
  total_categories: number
  pending_orders: number
  low_stock_products: Product[]
  recent_orders: Order[]
}

export async function getAdminStats(): Promise<AdminStats> {
  const res = await api.get('/admin/dashboard/stats')
  return unwrap<AdminStats>(res)
}
