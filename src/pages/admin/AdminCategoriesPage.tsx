import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import * as productApi from '@/api/products'
import { getErrorMessage, getValidationErrors } from '@/api/client'
import { queryKeys } from '@/lib/queryKeys'
import { useCategories } from '@/features/products/hooks'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Category } from '@/types'

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  is_active: z.boolean().optional(),
})

type CategoryForm = z.infer<typeof categorySchema>

export function AdminCategoriesPage() {
  const queryClient = useQueryClient()
  const { data: categories, isLoading } = useCategories()
  const [editing, setEditing] = useState<{ slug: string; name: string; description?: string; image?: string } | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', description: '', image: '', is_active: true },
    values: editing
      ? {
          name: editing.name,
          description: editing.description ?? '',
          image: editing.image ?? '',
          is_active: true,
        }
      : undefined,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
  }

  const saveMutation = useMutation({
    mutationFn: (payload: { slug?: string; data: Partial<Category> }) =>
      payload.slug
        ? productApi.updateCategory(payload.slug, payload.data)
        : productApi.createCategory(payload.data),
    onSuccess: () => {
      invalidate()
      toast.success(editing ? 'Category updated' : 'Category created')
      setEditing(null)
      reset()
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to save category')),
  })

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => productApi.deleteCategory(slug),
    onSuccess: () => {
      invalidate()
      toast.success('Category deleted')
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to delete category')),
  })

  const onSubmit = async (values: CategoryForm) => {
    const data: Partial<Category> = {
      name: values.name,
      description: values.description || undefined,
      image: values.image || undefined,
      is_active: values.is_active,
    }
    try {
      if (editing) {
        await saveMutation.mutateAsync({ slug: editing.slug, data })
      } else {
        await saveMutation.mutateAsync({ data })
      }
    } catch (error) {
      const errs = getValidationErrors(error)
      if (Object.keys(errs).length) {
        toast.error(Object.values(errs)[0])
      }
    }
  }

  const handleDelete = (slug: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(slug)
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Categories</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {editing ? `Edit "${editing.name}"` : 'New Category'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Name"
              error={errors.name?.message}
              {...register('name')}
            />
            <Textarea
              label="Description (optional)"
              rows={3}
              {...register('description')}
            />
            <Input
              label="Image URL (optional)"
              placeholder="https://example.com/category.jpg"
              {...register('image')}
            />
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" {...register('is_active')} />
              Active
            </label>
            <div className="flex gap-2">
              <Button type="submit" loading={isSubmitting}>
                {editing ? 'Update' : 'Create'}
              </Button>
              {editing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditing(null)
                    reset()
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Existing Categories</h2>
          </div>
          {isLoading ? (
            <div className="space-y-2 p-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : categories && categories.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {categories.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="font-medium text-gray-900">{cat.name}</p>
                    <p className="text-xs text-gray-500">
                      {cat.products_count ?? 0} products
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        setEditing({
                          slug: cat.slug,
                          name: cat.name,
                          description: cat.description ?? undefined,
                          image: cat.image ?? undefined,
                        })
                      }
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.slug, cat.name)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-6 text-gray-500">No categories yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}