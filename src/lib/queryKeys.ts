export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: unknown) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.products.details(), slug] as const,
    featured: () => [...queryKeys.products.all, 'featured'] as const,
  },
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: () => [...queryKeys.categories.lists()] as const,
    detail: (slug: string) => [...queryKeys.categories.all, 'detail', slug] as const,
  },
  cart: {
    all: ['cart'] as const,
    detail: () => [...queryKeys.cart.all, 'detail'] as const,
  },
  orders: {
    all: ['orders'] as const,
    mine: (page: number) => [...queryKeys.orders.all, 'mine', page] as const,
    detail: (id: number) => [...queryKeys.orders.all, 'detail', id] as const,
    admin: (filters: unknown) => [...queryKeys.orders.all, 'admin', filters] as const,
  },
  admin: {
    stats: () => ['admin', 'stats'] as const,
  },
}
