import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as cartApi from '@/api/cart'
import { getErrorMessage } from '@/api/client'
import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/store/auth'
import { useGuestCart } from '@/store/cart'
import type { Cart, Product } from '@/types'

function guestItem(product: Product, quantity: number): Cart['items'][number] {
  return {
    id: product.id,
    product_id: product.id,
    product,
    quantity,
    subtotal: product.price * quantity,
  }
}

export interface CartAPI {
  isLoggedIn: boolean
  items: Cart['items']
  total: number
  count: number
  isLoading: boolean
  add: (productId: number, quantity?: number) => void
  addProduct: (product: Product, quantity?: number) => void
  update: (key: number, quantity: number) => void
  remove: (key: number) => void
  clear: () => void
}

export function useCart(): CartAPI {
  const isLoggedIn = useAuthStore((s) => !!s.token)
  const queryClient = useQueryClient()
  const guest = useGuestCart()

  const serverQuery = useQuery<Cart>({
    queryKey: queryKeys.cart.detail(),
    queryFn: cartApi.getCart,
    enabled: isLoggedIn,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.all })

  const addToServer = useMutation({
    mutationFn: (payload: { productId: number; quantity?: number }) =>
      cartApi.addToCart(payload.productId, payload.quantity ?? 1),
    onSuccess: () => {
      invalidate()
      toast.success('Added to cart')
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to add to cart')),
  })

  const updateServer = useMutation({
    mutationFn: (payload: { itemId: number; quantity: number }) =>
      cartApi.updateCartItem(payload.itemId, payload.quantity),
    onSuccess: () => {
      invalidate()
      toast.success('Cart updated')
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update cart')),
  })

  const removeServer = useMutation({
    mutationFn: (itemId: number) => cartApi.removeCartItem(itemId),
    onSuccess: () => {
      invalidate()
      toast.success('Removed from cart')
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to remove item')),
  })

  const clearServer = useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      invalidate()
      toast.success('Cart cleared')
    },
  })

  if (isLoggedIn) {
    return {
      isLoggedIn: true,
      items: serverQuery.data?.items ?? [],
      total: serverQuery.data?.subtotal ?? 0,
      count: serverQuery.data?.items_count ?? 0,
      isLoading: serverQuery.isLoading,
      add: (productId, quantity) => addToServer.mutate({ productId, quantity }),
      addProduct: (product, quantity) => addToServer.mutate({ productId: product.id, quantity }),
      update: (itemId, quantity) => updateServer.mutate({ itemId, quantity }),
      remove: (itemId) => removeServer.mutate(itemId),
      clear: () => clearServer.mutate(),
    }
  }

  const guestAdd = (productId: number, quantity = 1) => {
    const product = queryClient.getQueryData<Product>(['products', 'detail', String(productId)])
    if (product) {
      guest.addItem(guestItem(product, quantity))
    }
    toast.success('Added to cart')
  }

  return {
    isLoggedIn: false,
    items: guest.items,
    total: guest.items.reduce((sum, i) => sum + i.subtotal, 0),
    count: guest.items.reduce((sum, i) => sum + i.quantity, 0),
    isLoading: false,
    add: guestAdd,
    addProduct: (product, quantity) => {
      guest.addItem(guestItem(product, quantity ?? 1))
      toast.success('Added to cart')
    },
    update: (productId, quantity) => guest.updateQuantity(productId, quantity),
    remove: (productId) => {
      guest.removeItem(productId)
      toast.success('Removed from cart')
    },
    clear: () => guest.clear(),
  }
}

export function useAddToCart() {
  const cart = useCart()
  return {
    mutate: (productId: number, quantity?: number) => cart.add(productId, quantity),
  }
}
