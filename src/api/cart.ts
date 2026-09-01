import { api, unwrap } from './client'
import type { Cart, CartItem } from '@/types'

export async function getCart(): Promise<Cart> {
  const res = await api.get('/cart')
  return unwrap<Cart>(res)
}

export async function addToCart(
  productId: number,
  quantity = 1,
): Promise<CartItem> {
  const res = await api.post('/cart/add', { product_id: productId, quantity })
  return unwrap<CartItem>(res)
}

export async function updateCartItem(
  itemId: number,
  quantity: number,
): Promise<CartItem> {
  const res = await api.put(`/cart/items/${itemId}`, { quantity })
  return unwrap<CartItem>(res)
}

export async function removeCartItem(itemId: number): Promise<void> {
  await api.delete(`/cart/items/${itemId}`)
}

export async function clearCart(): Promise<void> {
  await api.delete('/cart')
}
