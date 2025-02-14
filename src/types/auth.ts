import { type User } from '@firebase/auth'
import { z } from 'zod'

export enum UserRole {
  // eslint-disable-next-line no-unused-vars
  UTILITY,
  // eslint-disable-next-line no-unused-vars
  RESIDENTIAL,
  // eslint-disable-next-line no-unused-vars
  TECHNICIAN,
}

export interface AuthResponse {
  exists: boolean
  user?: User
}

export interface UserData {
  uid: string
  projectId: string
  email: string
  displayName: string | null
  phoneNumber: string
  photoURL: string | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
  credential: User
}

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
