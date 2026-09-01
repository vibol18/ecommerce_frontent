import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import * as authApi from '@/api/auth'
import { getErrorMessage, getValidationErrors } from '@/api/client'
import { useAuthStore } from '@/store/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
})

type ProfileForm = z.infer<typeof profileSchema>

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const fetchProfile = useAuthStore((s) => s.fetchProfile)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
    },
  })

  const onSubmit = async (values: ProfileForm) => {
    setServerErrors({})
    setSaving(true)
    try {
      await authApi.updateProfile(values)
      await fetchProfile()
      toast.success('Profile updated')
    } catch (error) {
      const errs = getValidationErrors(error)
      if (Object.keys(errs).length) {
        setServerErrors(errs)
      } else {
        toast.error(getErrorMessage(error, 'Failed to update profile'))
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Update your account details.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input
            label="Name"
            error={errors.name?.message ?? serverErrors.name}
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            error={errors.email?.message ?? serverErrors.email}
            {...register('email')}
          />
          <Button type="submit" loading={saving} className="w-full">
            Save changes
          </Button>
        </form>
      </div>
    </div>
  )
}
