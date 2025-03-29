import { getAuth, User } from '@firebase/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Logo } from '@/components'
import { useAuth } from '@/context'
import { api, handleError } from '@/lib'
import { ForgotPasswordForm, LoginForm, ProjectIdForm } from '@/routes/login'
import {
  FormState,
  LoginFormValues,
  Project,
  ProjectIdFormValues,
  ResetPasswordFormValues,
  UserRole,
  loginSchema,
  projectIdSchema,
  resetPasswordSchema,
} from '@/types'

const FORM_STATE_KEY = 'auth:loginFormState'

const LoginPage = () => {
  const { loginWithGoogle, login, createUserDocument, resetPassword, loading, user } = useAuth()
  const navigate = useNavigate()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const projectIdForm = useForm<ProjectIdFormValues>({
    resolver: zodResolver(projectIdSchema),
    defaultValues: { projectId: '' },
  })

  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
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

    sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(formState))

    return () => sessionStorage.removeItem(FORM_STATE_KEY)
  }, [formState])

  const navigateBasedOnRole = (role: UserRole) => {
    switch (role) {
      case UserRole.RESIDENTIAL:
        navigate('/app/dashboard')
        break
      case UserRole.UTILITY:
        navigate('/app/utility/dashboard')
        break
      default:
        navigate('/login')
    }
  }

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
      const response = await loginWithGoogle()
      if (!response.exists) {
        setFormState(prev => ({
          ...prev,
          isProjectIdStep: true,
          pendingUser: response.user!,
        }))
        return
      }
      resetFormState()
      if (user) {
        navigateBasedOnRole(user.role)
      } else {
        navigate('/login')
      }
    } catch (error) {
      loginForm.setError('root', {
        message: handleError(error),
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const onProjectIdSubmit = async (values: ProjectIdFormValues) => {
    if (!formState.pendingUser?.uid) {
      projectIdForm.setError('projectId', {
        message: 'User session expired. Please try again.',
      })
      return
    }

    const auth = getAuth()
    const currentUser = auth.currentUser

    if (!currentUser) {
      projectIdForm.setError('projectId', {
        message: 'User session expired. Please try again.',
      })
      return
    }

    let token: string

    try {
      token = await currentUser.getIdToken(true)
    } catch (error: unknown) {
      projectIdForm.setError('root', {
        message: handleError(error),
      })
      await cleanupUser(currentUser)
      return
    }

    try {
      await verifyProject(values.projectId, token)

      await createUserDocument(
        currentUser,
        currentUser.displayName || '',
        currentUser.phoneNumber || '',
        values.projectId,
      )

      await associateUserWithProject(values.projectId, currentUser.uid, token)

      resetFormState()
      if (user) {
        navigateBasedOnRole(user.role)
      } else {
        navigate('/login')
      }
    } catch (error) {
      await cleanupUser(currentUser)
      projectIdForm.setError('root', {
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

  const associateUserWithProject = async (projectId: string, userId: string, token: string) => {
    const response = await api.put(`/projects/${projectId}`, token, { user_id: userId })

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

  const onResetPassword = async (values: ResetPasswordFormValues) => {
    try {
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

      if (user) {
        navigateBasedOnRole(user.role)
      } else {
        navigate('/login')
      }
    } catch (error) {
      loginForm.setError('root', {
        message: handleError(error),
      })
    }
  }

  return (
    <div className="flex flex-col justify-center w-full h-full p-6 md:p-8">
      <div className="flex flex-col gap-4">
        <Logo size="xl" className="p-2" />
        {formState.isForgotPasswordStep ? (
          <ForgotPasswordForm
            form={resetPasswordForm}
            onSubmit={onResetPassword}
            onBack={resetFormState}
          />
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
            {formState.isProjectIdStep ? (
              <ProjectIdForm
                form={projectIdForm}
                onSubmit={onProjectIdSubmit}
                onBack={resetFormState}
              />
            ) : (
              <LoginForm
                form={loginForm}
                onSubmit={onLogin}
                onForgotPassword={() =>
                  setFormState(prev => ({ ...prev, isForgotPasswordStep: true }))
                }
                onGoogleLogin={handleLoginWithGoogle}
                isLoading={loading}
                isGoogleLoading={isGoogleLoading}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default LoginPage
