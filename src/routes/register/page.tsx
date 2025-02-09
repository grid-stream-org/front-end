import { getAuth, User } from '@firebase/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import * as z from 'zod'

import { Logo } from '@/components'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context'
import { handleError, api } from '@/lib'
import { Project } from '@/types'

// Form validation schema
const registerSchema = z
  .object({
    projectId: z.string().min(1, 'Project ID is required'),
    email: z.string().email('Invalid email address'),
    displayName: z.string().optional(),
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .optional()
      .or(z.literal('')),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string(),
  })
  .refine(data => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

const RegisterPage = () => {
  const { register, createUserDocument } = useAuth()
  const navigate = useNavigate()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      projectId: '',
      email: '',
      displayName: '',
      phone: '',
      password: '',
      confirm: '',
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    if (!values.email || !values.password) {
      form.setError('root', {
        message: 'Email and password are required.',
      })
      return
    }

    let registeredUser: User | null = null

    try {
      const { user } = await register(values.email, values.password)
      if (!user) {
        throw new Error('User creation failed')
      }
      registeredUser = user

      let token: string
      try {
        token = await registeredUser.getIdToken(true)
      } catch (error: unknown) {
        form.setError('root', {
          message: handleError(error),
        })
        await cleanupUser(registeredUser)
        return
      }

      try {
        await verifyProject(values.projectId, token)
        await associateUserWithProject(values.projectId, registeredUser.uid, token)
        await createUserDocument(registeredUser, values.displayName || '', values.phone || '')

        navigate('/app/dashboard')
      } catch (error) {
        await cleanupUser(registeredUser)
        form.setError('root', {
          message: handleError(error),
        })
      }
    } catch (error) {
      form.setError('root', {
        message: handleError(error),
      })
    }
  }

  const verifyProject = async (projectId: string, token: string): Promise<void> => {
    const response = await api.get(`/projects/${projectId}`, token)
    const project = response.data as Project

    if (response.status !== 200 || project.user_id !== '') {
      throw new Error('Invalid Project ID. Please verify your registration information.')
    }
  }

  const associateUserWithProject = async (
    projectId: string,
    userId: string,
    token: string,
  ): Promise<void> => {
    const response = await api.put(`/projects/${projectId}`, { user_id: userId }, token)

    if (response.status !== 200) {
      throw new Error('Unable to associate account with Project ID. Please contact support.')
    }
  }

  const cleanupUser = async (user: User) => {
    try {
      const auth = getAuth()
      const currentUser = auth.currentUser
      if (currentUser && currentUser.uid === user.uid) {
        await currentUser.delete()
      }
    } catch (error) {
      console.error('Failed to cleanup user:', error)
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-center h-full w-full p-6 md:p-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4">
          <Logo size="xl" className="p-2" />
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your details below to register
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-none md:grid-rows-3 place-content-center gap-3 w-full">
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project ID*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Project ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 000-0000" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password*</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password*</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {form.formState.errors.root && (
            <span className="text-[0.8rem] font-medium text-destructive">
              {form.formState.errors.root.message}
            </span>
          )}

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          <div className="text-center text-sm">
            Already have an account?&nbsp;
            <Link to="/login" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default RegisterPage
