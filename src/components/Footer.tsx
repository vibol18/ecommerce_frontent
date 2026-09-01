import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-indigo-600">
              Shop<span className="text-gray-900">ora</span>
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              A modern e-commerce store built with React, TypeScript, and Tailwind CSS.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Shop</h4>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>
                <Link to="/products" className="hover:text-indigo-600">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-indigo-600">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Account</h4>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>
                <Link to="/login" className="hover:text-indigo-600">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-600">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Shopora. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
