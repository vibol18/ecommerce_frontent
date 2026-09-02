import { Link } from 'react-router-dom'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-bold text-indigo-400">
              Bol<span className="text-white">Shop</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              A modern e-commerce store built with React, TypeScript, and Tailwind CSS.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-indigo-600 hover:text-white"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-indigo-600 hover:text-white"
                aria-label="Twitter"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-indigo-600 hover:text-white"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/products" className="transition-colors hover:text-indigo-400">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="transition-colors hover:text-indigo-400">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="transition-colors hover:text-indigo-400">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Account</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/login" className="transition-colors hover:text-indigo-400">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="transition-colors hover:text-indigo-400">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/account/orders" className="transition-colors hover:text-indigo-400">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/account/profile" className="transition-colors hover:text-indigo-400">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Support</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-400">
              <li className="leading-relaxed">Help center &amp; FAQ</li>
              <li className="leading-relaxed">Shipping information</li>
              <li className="leading-relaxed">Return policy</li>
              <li className="leading-relaxed">Contact us</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          &copy; {year} BolShop. All rights reserved. Built with React &amp; Vite.
        </div>
      </div>
    </footer>
  )
}
