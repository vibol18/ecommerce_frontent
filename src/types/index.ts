export interface User {
  id: number
  name: string
  email: string
  phone?: string | null
  role: 'customer' | 'admin'
  created_at?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string | null
  parent_id?: number | null
  image?: string | null
  is_active?: boolean
  products_count?: number
  children?: Category[]
  created_at?: string
}

export interface Review {
  id: number
  product_id: number
  user: User
  rating: number
  title?: string | null
  comment?: string | null
  created_at?: string
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  compare_price?: number | null
  stock: number
  category_id: number
  category?: Category | null
  images: string[]
  status: 'active' | 'inactive' | 'out_of_stock'
  is_featured?: boolean
  weight?: number | null
  reviews?: Review[]
  reviews_count?: number
  average_rating?: number
  created_at?: string
}

export interface CartItem {
  id: number
  product_id: number
  product: Product
  quantity: number
  subtotal: number
}

export interface Cart {
  items: CartItem[]
  items_count: number
  subtotal: number
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'

export interface OrderItem {
  id: number
  product_id: number
  product_name: string
  price: number
  quantity: number
  total: number
}

export interface Payment {
  id: number
  order_id: number
  transaction_id?: string | null
  method: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  amount: number
  paid_at?: string | null
}

export interface Order {
  id: number
  order_number: string
  user_id: number
  user?: User | null
  status: OrderStatus
  subtotal: number
  tax: number
  shipping_cost: number
  total: number
  shipping_address: string | null
  billing_address?: string | null
  notes?: string | null
  payment?: Payment | null
  items: OrderItem[]
  created_at?: string
}

export interface AuthResponse {
  user: User
  token: string
  token_type: string
}

export interface Paginated<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string[]>
  meta?: {
    current_page?: number
    last_page?: number
    per_page?: number
    total?: number
    from?: number | null
    to?: number | null
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
  phone?: string
  password_confirmation?: string
}

export type ProductSort =
  | 'price_low'
  | 'price_high'
  | 'name_asc'
  | 'name_desc'
  | 'newest'
  | 'oldest'

export interface ProductFilters {
  page?: number
  per_page?: number
  search?: string
  category_id?: number
  min_price?: number
  max_price?: number
  status?: 'active' | 'inactive' | 'out_of_stock' | 'all'
  featured?: boolean
  active_only?: boolean
  sort_by?: 'name' | 'price' | 'stock' | 'created_at' | 'updated_at'
  sort_direction?: 'asc' | 'desc'
}
