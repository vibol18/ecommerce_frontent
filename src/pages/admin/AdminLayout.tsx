import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navItem = ({ isActive }: { isActive: boolean }) =>
  cn(
    'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-indigo-600 text-white'
      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
  )

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products', end: false },
  { to: '/admin/categories', label: 'Categories', end: false },
  { to: '/admin/orders', label: 'Orders', end: false },
]

export function AdminLayout() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
      <aside className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 px-3 text-sm font-bold uppercase tracking-wide text-gray-500">
          Admin
        </h2>
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navItem} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
