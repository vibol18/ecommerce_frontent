import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export function Select({ label, error, className, id, children, ...props }: SelectProps) {
  const selectId = id ?? props.name
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-indigo-500',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
