import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import * as ordersApi from '@/api/orders'
import { getErrorMessage } from '@/api/client'
import { queryKeys } from '@/lib/queryKeys'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

const checkoutSchema = z.object({
  shipping_address: z.string().min(5, 'Enter a valid shipping address'),
  payment_method: z.string().min(1, 'Select a payment method'),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

const shippingPrice = (total: number) => (total >= 100 || total === 0 ? 0 : 10)

export function CheckoutPage() {
  const cart = useCart()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)

  const { data: paymentMethods } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: ordersApi.getPaymentMethods,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { payment_method: 'cod' },
  })

  const subtotal = cart.total
  const shipping = shippingPrice(subtotal)
  const total = subtotal + shipping

  const onSubmit = async (values: CheckoutForm) => {
    setLoading(true)
    try {
      const order = await ordersApi.placeOrder({
        shipping_address: values.shipping_address,
        payment_method: values.payment_method,
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
      toast.success('Order placed successfully!')
      navigate(`/account/orders/${order.id}`)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to place order'))
    } finally {
      setLoading(false)
    }
  }

  if (!cart.isLoggedIn) {
    return (
      <EmptyState
        title="Please sign in to checkout"
        description="You need to be logged in to complete your order."
        action={
          <Link
            to={`/login?redirect=${encodeURIComponent('/checkout')}`}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Sign in
          </Link>
        }
      />
    )
  }

  if (cart.items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        action={
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>
        <form
          id="checkout-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
        >
          <div>
            <Input
              label="Shipping address"
              placeholder="123 Main St, Apt 4, Springfield, IL 62704"
              error={errors.shipping_address?.message}
              {...register('shipping_address')}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Payment method
            </label>
            <div className="space-y-2">
              {(paymentMethods ?? []).map((method) => (
                <label
                  key={method.value}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 p-3 text-sm"
                >
                  <input
                    type="radio"
                    value={method.value}
                    {...register('payment_method')}
                  />
                  {method.label}
                </label>
              ))}
            </div>
            {errors.payment_method?.message && (
              <p className="mt-1 text-sm text-red-600">{errors.payment_method.message}</p>
            )}
          </div>
        </form>
      </div>

      <div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">Order Review</h2>
          <div className="mt-4 space-y-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="flex-1 text-gray-700">
                  {item.product.name} <span className="text-gray-400">× {item.quantity}</span>
                </span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
        <Button
          type="submit"
          form="checkout-form"
          className="mt-4 w-full"
          size="lg"
          loading={loading}
        >
          Place Order
        </Button>
      </div>
    </div>
  )
}
