import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCategories } from '@/features/products/hooks'
import type { ProductFilters } from '@/types'

const filterSchema = z.object({
  search: z.string().optional(),
  category_id: z.string().optional(),
  sort_by: z.string().optional(),
  min_price: z.string().optional(),
  max_price: z.string().optional(),
})

type FilterForm = z.infer<typeof filterSchema>

interface Props {
  filters: ProductFilters
  onApply: (filters: ProductFilters) => void
}

export function ProductFilters({ filters, onApply }: Props) {
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const [expanded, setExpanded] = useState(false)

  const { register, handleSubmit, reset } = useForm<FilterForm>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: filters.search ?? '',
      category_id: filters.category_id ? String(filters.category_id) : '',
      sort_by: filters.sort_by ?? '',
      min_price: filters.min_price !== undefined ? String(filters.min_price) : '',
      max_price: filters.max_price !== undefined ? String(filters.max_price) : '',
    },
  })

  const onSubmit = (values: FilterForm) => {
    const sortMap: Record<string, { sort_by: string; sort_direction: string }> = {
      price_high: { sort_by: 'price', sort_direction: 'desc' },
      price_low: { sort_by: 'price', sort_direction: 'asc' },
      name_asc: { sort_by: 'name', sort_direction: 'asc' },
      name_desc: { sort_by: 'name', sort_direction: 'desc' },
      newest: { sort_by: 'created_at', sort_direction: 'desc' },
      oldest: { sort_by: 'created_at', sort_direction: 'asc' },
    }
    const sort = values.sort_by ? sortMap[values.sort_by] : undefined
    onApply({
      search: values.search || undefined,
      category_id: values.category_id ? Number(values.category_id) : undefined,
      min_price: values.min_price ? Number(values.min_price) : undefined,
      max_price: values.max_price ? Number(values.max_price) : undefined,
      sort_by: sort?.sort_by as ProductFilters['sort_by'],
      sort_direction: sort?.sort_direction as ProductFilters['sort_direction'],
    })
  }

  const handleReset = () => {
    reset({ search: '', category_id: '', sort_by: '', min_price: '', max_price: '' })
    onApply({})
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-lg border border-gray-200 bg-white p-4"
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="mb-3 flex w-full items-center justify-between text-sm font-semibold text-gray-900 md:pointer-events-none md:cursor-default"
      >
        Filters
        <span className="md:hidden">{expanded ? 'Hide' : 'Show'}</span>
      </button>

      <div className={`space-y-4 ${expanded ? 'block' : 'hidden md:block'}`}>
        <div>
          <Input label="Search" placeholder="Search products..." {...register('search')} />
        </div>

        <div>
          <Select label="Category" {...register('category_id')}>
            <option value="">All categories</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Min price"
            type="number"
            step="0.01"
            placeholder="0"
            {...register('min_price')}
          />
          <Input
            label="Max price"
            type="number"
            step="0.01"
            placeholder="1000"
            {...register('max_price')}
          />
        </div>

        <div>
          <Select label="Sort by" {...register('sort_by')}>
            <option value="">Default</option>
            <option value="price_high">Price: High to Low</option>
            <option value="price_low">Price: Low to High</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="newest">Newest</option>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button type="submit" size="sm" className="flex-1">
            Apply
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>
      {categoriesLoading && <p className="mt-2 text-xs text-gray-400">Loading categories...</p>}
    </form>
  )
}
