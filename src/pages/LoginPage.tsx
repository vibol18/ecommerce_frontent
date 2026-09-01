import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { getValidationErrors } from '@/api/client'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginForm) => {
    setServerErrors({})
    try {
      await login(values)
      toast.success('Welcome back!')
      const redirect = new URLSearchParams(window.location.search).get('redirect')
      navigate(redirect ?? '/')
    } catch (error) {
      const errs = getValidationErrors(error)
      if (Object.keys(errs).length) {
        setServerErrors(errs)
      } else {
        toast.error('Invalid email or password')
      }
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
        <p className="mt-1 text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>

        {serverErrors.general && (
          <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {serverErrors.general}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message ?? serverErrors.email}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message ?? serverErrors.password}
            {...register('password')}
          />
          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}
