import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null

  const pages: number[] = []
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(lastPage, start + 4)

  for (let p = start; p <= end; p++) {
    pages.push(p)
  }

  return (
    <nav className="mt-8 flex items-center justify-center gap-1">
      <button
        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={cn(
            'rounded-md border px-3 py-2 text-sm',
            p === currentPage
              ? 'border-indigo-600 bg-indigo-600 text-white'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50',
          )}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
      <button
        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= lastPage}
      >
        Next
      </button>
    </nav>
  )
}
