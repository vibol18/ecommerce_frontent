import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import * as productApi from '@/api/products'
import { getErrorMessage, getValidationErrors } from '@/api/client'
import { queryKeys } from '@/lib/queryKeys'
import { useCategories, useProduct } from '@/features/products/hooks'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().refine((v) => v !== '' && !Number.isNaN(Number(v)) && Number(v) >= 0, 'Price must be a valid number'),
  compare_price: z.string().optional(),
  stock: z.string().refine((v) => v !== '' && !Number.isNaN(Number(v)) && Number.isInteger(Number(v)) && Number(v) >= 0, 'Stock must be a whole number'),
  category_id: z.string().min(1, 'Select a category'),
  status: z.enum(['active', 'inactive', 'out_of_stock']),
  is_featured: z.boolean().optional(),
  weight: z.string().optional(),
  images: z.string().optional(),
})

type ProductForm = z.infer<typeof productSchema>

export function AdminProductFormPage() {
  const { slug } = useParams<{ slug: string }>()
  const isEdit = Boolean(slug)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: categories } = useCategories()
  const { data: product, isLoading } = useProduct(slug ?? '')
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      compare_price: '',
      stock: '',
      category_id: '',
      status: 'active',
      is_featured: false,
      weight: '',
      images: '',
    },
    values:
      isEdit && product
        ? {
            name: product.name,
            description: product.description,
            price: String(product.price),
            compare_price: product.compare_price !== null && product.compare_price !== undefined
              ? String(product.compare_price)
              : '',
            stock: String(product.stock),
            category_id: String(product.category_id),
            status: product.status,
            is_featured: product.is_featured ?? false,
            weight: product.weight !== null && product.weight !== undefined ? String(product.weight) : '',
            images: (product.images ?? []).join('\n'),
          }
        : undefined,
  })

  const onSubmit = async (values: ProductForm) => {
    setServerErrors({})
    const payload = {
      name: values.name,
      description: values.description,
      price: Number(values.price),
      compare_price: values.compare_price ? Number(values.compare_price) : undefined,
      stock: Number(values.stock),
      category_id: Number(values.category_id),
      status: values.status,
      is_featured: values.is_featured,
      weight: values.weight ? Number(values.weight) : undefined,
      images: values.images
        ? values.images.split('\n').map((u) => u.trim()).filter(Boolean)
        : [],
    }
    try {
      if (isEdit && slug) {
        await productApi.updateProduct(slug, payload)
        toast.success('Product updated')
      } else {
        await productApi.createProduct(payload)
        toast.success('Product created')
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      navigate('/admin/products')
    } catch (error) {
      const errs = getValidationErrors(error)
      if (Object.keys(errs).length) {
        setServerErrors(errs)
      } else {
        toast.error(getErrorMessage(error, 'Failed to save product'))
      }
    }
  }

  if (isEdit && isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Product' : 'New Product'}
        </h1>
        <Link to="/admin/products" className="text-sm text-indigo-600 hover:underline">
          ← Back
        </Link>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-lg border border-gray-200 bg-white p-6"
      >
        <Input
          label="Name"
          error={errors.name?.message ?? serverErrors.name}
          {...register('name')}
        />

        <Textarea
          label="Description"
          rows={4}
          error={errors.description?.message ?? serverErrors.description}
          {...register('description')}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Price"
            type="number"
            step="0.01"
            min="0"
            error={errors.price?.message ?? serverErrors.price}
            {...register('price')}
          />
          <Input
            label="Compare price (optional)"
            type="number"
            step="0.01"
            min="0"
            error={errors.compare_price?.message ?? serverErrors.compare_price}
            {...register('compare_price')}
          />
          <Input
            label="Stock"
            type="number"
            min="0"
            error={errors.stock?.message ?? serverErrors.stock}
            {...register('stock')}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            label="Category"
            className="col-span-2"
            error={errors.category_id?.message ?? serverErrors.category_id}
            {...register('category_id')}
          >
            <option value="">Select category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
          <Select label="Status" {...register('status')}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="out_of_stock">Out of stock</option>
          </Select>
        </div>

        <Input
          label="Weight (optional)"
          type="number"
          step="0.01"
          min="0"
          error={serverErrors.weight}
          {...register('weight')}
        />

        <Textarea
          label="Image URLs (one per line)"
          rows={3}
          placeholder="https://example.com/image1.jpg"
          error={serverErrors.images}
          {...register('images')}
        />

        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register('is_featured')} />
          Feature this product on the homepage
        </label>

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Create product'}
          </Button>
          <Link to="/admin/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}