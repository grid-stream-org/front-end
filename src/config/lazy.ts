import { lazy } from 'react'

export const AppLayout = lazy(async () => {
  const module = await import('@/layouts')
  return { default: module.AppLayout }
})

export const AuthLayout = lazy(async () => {
  const module = await import('@/layouts')
  return { default: module.AuthLayout }
})

export const ProtectedRoute = lazy(async () => {
  const module = await import('@/layouts')
  return { default: module.Protected }
})
