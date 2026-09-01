import { api, unwrap } from './client'
import type { AuthResponse, LoginCredentials, RegisterData, User } from '@/types'

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const res = await api.post('/login', credentials)
  return unwrap<AuthResponse>(res)
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const res = await api.post('/register', data)
  return unwrap<AuthResponse>(res)
}

export async function logout(): Promise<void> {
  await api.post('/logout')
}

export async function getProfile(): Promise<User> {
  const res = await api.get('/user')
  return unwrap<User>(res)
}

export async function updateProfile(data: Partial<RegisterData>): Promise<User> {
  const res = await api.put('/user', data)
  return unwrap<User>(res)
}
