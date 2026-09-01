import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'

const navLink = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
  )

export function Navbar() {
  const user = useAuthStore((s) => s.user)
  const isAdmin = useAuthStore((s) => s.isAdmin)
  const logout = useAuthStore((s) => s.logout)
  const count = useCart().count
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Shop<span className="text-gray-900">ora</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={navLink} end>
            Home
          </NavLink>
          <NavLink to="/products" className={navLink}>
            Products
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={navLink}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative rounded-md p-2 text-gray-700 hover:bg-gray-100"
            aria-label="Cart"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 4.6a1 1 0 00.9 1.4h12.8M16 17h-6"
              />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="group relative flex items-center gap-2 rounded-md p-2 hover:bg-gray-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden text-sm lg:block">
                <p className="font-medium leading-tight text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <div className="invisible absolute right-0 top-full z-50 mt-1 w-48 rounded-md border border-gray-200 bg-white py-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                {isAdmin && (
                  <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/account/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  My Orders
                </Link>
                <Link to="/account/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
