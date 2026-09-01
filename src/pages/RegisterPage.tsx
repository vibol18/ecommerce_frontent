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

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  })

type RegisterForm = z.infer<typeof registerSchema>

export function RegisterPage() {
  const register = useAuthStore((s) => s.register)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (values: RegisterForm) => {
    setServerErrors({})
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      })
      toast.success('Account created!')
      navigate('/')
    } catch (error) {
      const errs = getValidationErrors(error)
      if (Object.keys(errs).length) {
        setServerErrors(errs)
      } else {
        toast.error('Registration failed. Please try again.')
      }
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
        <p className="mt-1 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input
            label="Name"
            placeholder="John Doe"
            error={errors.name?.message ?? serverErrors.name}
            {...registerField('name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message ?? serverErrors.email}
            {...registerField('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            error={errors.password?.message ?? serverErrors.password}
            {...registerField('password')}
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="Re-enter password"
            error={errors.password_confirmation?.message ?? serverErrors.password_confirmation}
            {...registerField('password_confirmation')}
          />
          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            Create account
          </Button>
        </form>
      </div>
    </div>
  )
}
