import { type User } from '@firebase/auth'
import { z } from 'zod'

export interface FormState {
  isProjectIdStep: boolean
  isForgotPasswordStep: boolean
  pendingUser: User | null
}

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const projectIdSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type ProjectIdFormValues = z.infer<typeof projectIdSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
