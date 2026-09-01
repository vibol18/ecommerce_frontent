import axios, { AxiosError, AxiosHeaders } from 'axios'
import { useAuthStore } from '@/store/auth'
import type { ApiResponse } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://laravel-ecommerce-lx44.onrender.com/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers = AxiosHeaders.from(config.headers).set(
      'Authorization',
      `Bearer ${token}`,
    )
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError<ApiResponse<never>>) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? ''
      if (!url.includes('/login')) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export function unwrap<T>(response: { data: ApiResponse<T> }): T {
  const body = response.data
  if (body && body.meta) {
    return { data: body.data, ...body.meta } as unknown as T
  }
  if (body && body.data === undefined) {
    return body as unknown as T
  }
  return body?.data as T
}
export function getValidationErrors(error: unknown): Record<string, string> {
  const axiosError = error as AxiosError<ApiResponse<never>>
  const errors = axiosError.response?.data?.errors ?? {}
  const flat: Record<string, string> = {}
  for (const [key, messages] of Object.entries(errors)) {
    flat[key] = messages?.[0] ?? 'Invalid value'
  }
  return flat
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  const axiosError = error as AxiosError<ApiResponse<never>>
  return axiosError.response?.data?.message ?? fallback
}
