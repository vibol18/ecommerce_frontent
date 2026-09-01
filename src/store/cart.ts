import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface GuestCartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQuantity: (productId: number, quantity: number) => void
  removeItem: (productId: number) => void
  clear: () => void
  getTotal: () => number
  getCount: () => number
}

export const useGuestCart = create<GuestCartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === item.product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === item.product.id
                  ? { ...i, quantity: i.quantity + item.quantity, subtotal: (i.quantity + item.quantity) * i.product.price }
                  : i,
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.product.id !== productId)
              : state.items.map((i) =>
                  i.product.id === productId
                    ? { ...i, quantity, subtotal: quantity * i.product.price }
                    : i,
                ),
        }))
      },

      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) }))
      },

      clear: () => set({ items: [] }),

      getTotal: () => get().items.reduce((sum, i) => sum + i.subtotal, 0),

      getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'guest-cart' },
  ),
)
