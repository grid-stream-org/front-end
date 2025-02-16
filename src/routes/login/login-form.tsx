import { Loader2 } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { Link } from 'react-router-dom'

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
import { LoginFormValues } from '@/types/auth'

interface LoginFormProps {
  form: UseFormReturn<LoginFormValues>
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: LoginFormValues) => Promise<void>
  onForgotPassword: () => void
  onGoogleLogin: () => Promise<void>
  isLoading: boolean
  isGoogleLoading: boolean
}

export const LoginForm = ({
  form,
  onSubmit,
  onForgotPassword,
  onGoogleLogin,
  isLoading,
  isGoogleLoading,
}: LoginFormProps) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <FormField
          control={form.control}
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
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <button
                  type="button"
                  onClick={onForgotPassword}
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
        {form.formState.errors.root && (
          <span className="text-[0.8rem] font-medium text-destructive">
            {form.formState.errors.root.message}
          </span>
        )}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting || isLoading ? (
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
          onClick={onGoogleLogin}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in with Google
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
