import { api, unwrap } from './client'
import type { Order, OrderStatus, Paginated } from '@/types'

export interface CheckoutData {
  shipping_address: string
  billing_address?: string
  notes?: string
  payment_method: string
}

export async function placeOrder(data: CheckoutData): Promise<Order> {
  const res = await api.post('/orders/checkout', data)
  return unwrap<Order>(res)
}

export async function getOrders(): Promise<Paginated<Order>> {
  const res = await api.get('/orders')
  return unwrap<Paginated<Order>>(res)
}

export async function getOrder(id: number): Promise<Order> {
  const res = await api.get(`/orders/${id}`)
  return unwrap<Order>(res)
}

export interface AdminOrderFilters {
  page?: number
  per_page?: number
  status?: string
  search?: string
}

export async function getAdminOrders(filters: AdminOrderFilters = {}): Promise<Paginated<Order>> {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      params.set(key, String(value))
    }
  })
  const res = await api.get('/orders/admin/all', { params })
  return unwrap<Paginated<Order>>(res)
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
  const res = await api.patch(`/orders/${id}/status`, { status })
  return unwrap<Order>(res)
}

export interface PaymentMethod {
  value: string
  label: string
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const res = await api.get('/payment-methods')
  return unwrap<PaymentMethod[]>(res)
}
