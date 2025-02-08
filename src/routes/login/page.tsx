import { type User } from '@firebase/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import * as z from 'zod'

import { Logo } from '@/components'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context'
import { api, handleError } from '@/lib'
import { Project } from '@/types'

const FORM_STATE_KEY = 'auth:loginFormState'

interface FormState {
  isProjectIdStep: boolean
  isForgotPasswordStep: boolean
  pendingUser: User | null
}

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const projectIdSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
})

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type LoginFormValues = z.infer<typeof loginSchema>
type ProjectIdFormValues = z.infer<typeof projectIdSchema>
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

const LoginPage = () => {
  const { loginWithGoogle, login, createUserDocument, resetPassword, loading } = useAuth()
  const navigate = useNavigate()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  // Initialize forms for different steps
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const projectIdForm = useForm<ProjectIdFormValues>({
    resolver: zodResolver(projectIdSchema),
    defaultValues: {
      projectId: '',
    },
  })

  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const [formState, setFormState] = useState<FormState>({
    isProjectIdStep: false,
    isForgotPasswordStep: false,
    pendingUser: null,
  })

  useEffect(() => {
    const savedState = sessionStorage.getItem(FORM_STATE_KEY)
    if (savedState) {
      setFormState(JSON.parse(savedState))
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(formState))
  }, [formState])

  useEffect(() => {
    return () => {
      sessionStorage.removeItem(FORM_STATE_KEY)
    }
  }, [])

  const resetFormState = () => {
    setFormState({
      isProjectIdStep: false,
      isForgotPasswordStep: false,
      pendingUser: null,
    })
    loginForm.reset()
    projectIdForm.reset()
    resetPasswordForm.reset()
    sessionStorage.removeItem(FORM_STATE_KEY)
  }

  const handleLoginWithGoogle = async () => {
    try {
      setIsGoogleLoading(true)
      const { exists, user } = await loginWithGoogle()

      if (!exists) {
        setFormState(prev => ({
          ...prev,
          isProjectIdStep: true,
          pendingUser: user!,
        }))
        return
      }
      resetFormState()
      navigate('/app/dashboard')
    } catch (error) {
      loginForm.setError('root', {
        message: handleError(error),
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const onProjectIdSubmit = async (values: ProjectIdFormValues) => {
    let createdUser = null
    try {
      if (!formState.pendingUser) {
        projectIdForm.setError('projectId', {
          message: 'User session expired. Please try again.',
        })
        return
      }

      createdUser = formState.pendingUser

      const token = await formState.pendingUser.getIdToken(true)

      // Verify project exists
      const projectResponse = await api.get(`/projects/${values.projectId}`, token)
      const project: Project = projectResponse.data as Project
      if (projectResponse.status !== 200 || project.user_id !== '') {
        projectIdForm.setError('projectId', {
          message: 'Invalid project ID. Please verify your registration information.',
        })
        return
      }

      // Update project with user id
      const updateResponse = await api.put(
        `/projects/${values.projectId}`,
        {
          user_id: formState.pendingUser.uid,
        },
        token,
      )

      if (updateResponse.status !== 200) {
        projectIdForm.setError('projectId', {
          message: 'Unable to associate account with Project ID. Please contact support.',
        })
        return
      }

      resetFormState()
      await createUserDocument(
        formState.pendingUser,
        formState.pendingUser.displayName || '',
        formState.pendingUser.phoneNumber || '',
      )
      navigate('/app/dashboard')
    } catch (error: unknown) {
      // Clean up created user if any step fails
      if (createdUser) {
        await createdUser.delete()
      }

      projectIdForm.setError('root', {
        message: handleError(error),
      })
    }
  }

  const onResetPassword = async (values: ResetPasswordFormValues) => {
    try {
      // TODO: Need to do this process properly
      await resetPassword(values.email)
      resetPasswordForm.setError('root', {
        message: 'Password reset instructions have been sent to your email.',
        type: 'success',
      })
    } catch (error) {
      resetPasswordForm.setError('root', {
        message: handleError(error),
      })
    }
  }

  const onLogin = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password)
      resetFormState()
      navigate('/app/dashboard')
    } catch (error) {
      loginForm.setError('root', {
        message: handleError(error),
      })
    }
  }

  const renderForgotPassword = () => (
    <Form {...resetPasswordForm}>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email address and we&apos;ll send you instructions to reset your password.
        </p>
      </div>
      <form onSubmit={resetPasswordForm.handleSubmit(onResetPassword)} className="grid gap-4">
        <FormField
          control={resetPasswordForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {resetPasswordForm.formState.errors.root && (
          <span
            className={
              resetPasswordForm.formState.errors.root.type === 'success'
                ? 'text-[0.8rem] font-medium text-success'
                : 'text-[0.8rem] font-medium text-destructive'
            }
          >
            {resetPasswordForm.formState.errors.root.message}
          </span>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={resetPasswordForm.formState.isSubmitting}
        >
          {resetPasswordForm.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Instructions
            </>
          ) : (
            'Send Reset Instructions'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={resetFormState}>
          Back to Login
        </Button>
      </form>
    </Form>
  )

  const renderProjectIdStep = () => (
    <Form {...projectIdForm}>
      <form onSubmit={projectIdForm.handleSubmit(onProjectIdSubmit)}>
        <FormField
          control={projectIdForm.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter your project ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {projectIdForm.formState.errors.root && (
          <span className="text-[0.8rem] font-medium text-destructive">
            {projectIdForm.formState.errors.root.message}
          </span>
        )}

        <Button
          type="submit"
          className="w-full mt-4"
          disabled={projectIdForm.formState.isSubmitting}
        >
          {projectIdForm.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Completing Registration
            </>
          ) : (
            'Complete Registration'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={resetFormState} className="w-full mt-2">
          Back to Login
        </Button>
      </form>
    </Form>
  )

  const renderLoginForm = () => (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onLogin)}>
        <div className="flex flex-col gap-4">
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Password</FormLabel>
                  <button
                    type="button"
                    onClick={() => setFormState(prev => ({ ...prev, isForgotPasswordStep: true }))}
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
                <FormControl>
                  <Input type="password" placeholder="••••••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {loginForm.formState.errors.root && (
            <span className="text-[0.8rem] font-medium text-destructive">
              {loginForm.formState.errors.root.message}
            </span>
          )}

          <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
            {loginForm.formState.isSubmitting || loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in
              </>
            ) : (
              'Login'
            )}
          </Button>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleLoginWithGoogle}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in with Google
              </>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
            )}
          </Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="underline underline-offset-4">
              Register
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )

  return (
    <div className="flex flex-col justify-center w-full h-full p-6 md:p-8">
      <div className="flex flex-col gap-4">
        <Logo size="xl" className="p-2" />

        {formState.isForgotPasswordStep ? (
          renderForgotPassword()
        ) : (
          <>
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">
                {formState.isProjectIdStep ? 'Complete Registration' : 'Welcome back'}
              </h1>
              <p className="text-balance text-muted-foreground">
                {formState.isProjectIdStep
                  ? 'Please enter your Project ID to continue'
                  : 'Login to your GridStream account'}
              </p>
            </div>
            {formState.isProjectIdStep ? renderProjectIdStep() : renderLoginForm()}
          </>
        )}
      </div>
    </div>
  )
}

export default LoginPage
