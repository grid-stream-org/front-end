import { render, waitFor } from '@testing-library/react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRef, useEffect } from 'react'

import { AuthProvider, useAuth } from '@/context/auth-provider'

describe('Auth Provider', () => {
  it('calls signInWithEmailAndPassword when login is called', async () => {
    // eslint-disable-next-line no-unused-vars
    const loginRef = useRef<((email: string, password: string) => Promise<void>) | null>(null)

    const TestHook = () => {
      const auth = useAuth()
      useEffect(() => {
        loginRef.current = auth.login
      }, [auth])
      return null
    }

    // Render with the AuthProvider
    render(
      <AuthProvider>
        <TestHook />
      </AuthProvider>,
    )

    // Wait until loginRef.current is assigned
    await waitFor(() => {
      expect(loginRef.current).not.toBeNull()
    })

    // Ensure TypeScript knows loginRef.current is non-null
    if (loginRef.current) {
      await loginRef.current('test@example.com', 'password123')
    } else {
      throw new Error('loginFunction was not set')
    }

    // Verify login was called with correct parameters
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      {}, // Mocked auth object
      'test@example.com',
      'password123',
    )
  })
})
