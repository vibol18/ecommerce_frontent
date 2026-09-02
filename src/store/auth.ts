import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, LoginCredentials, RegisterData } from '@/types'
import * as authApi from '@/api/auth'
import * as cartApi from '@/api/cart'
import { useGuestCart } from '@/store/cart'

interface AuthState {
  user: User | null
  token: string | null
  isAdmin: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  registerAdmin: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  fetchProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAdmin: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const { user, token } = await authApi.login(credentials)
          set({
            user,
            token,
            isAdmin: user.role === 'admin',
            isLoading: false,
          })
          const guestCart = useGuestCart.getState()
          if (guestCart.items.length > 0) {
            for (const item of guestCart.items) {
              await cartApi.addToCart(item.product_id, item.quantity)
            }
            guestCart.clear()
          }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data) => {
        set({ isLoading: true })
        try {
          const { user, token } = await authApi.register(data)
          set({
            user,
            token,
            isAdmin: user.role === 'admin',
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      registerAdmin: async (data) => {
        set({ isLoading: true })
        try {
          const { user, token } = await authApi.registerAdmin(data)
          set({
            user,
            token,
            isAdmin: user.role === 'admin',
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await authApi.logout()
        } catch {
          // ignore logout API failures
        }
        set({ user: null, token: null, isAdmin: false })
      },

      fetchProfile: async () => {
        const token = get().token
        if (!token) return
        try {
          const user = await authApi.getProfile()
          set({ user, isAdmin: user.role === 'admin' })
        } catch {
          // handled by axios 401 interceptor
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAdmin: state.isAdmin }),
    },
  ),
)
