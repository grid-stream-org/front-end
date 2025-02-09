import { Loader2 } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

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
import { ResetPasswordFormValues } from '@/types/auth'

interface ForgotPasswordFormProps {
  form: UseFormReturn<ResetPasswordFormValues>
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: ResetPasswordFormValues) => Promise<void>
  onBack: () => void
}

export const ForgotPasswordForm = ({ form, onSubmit, onBack }: ForgotPasswordFormProps) => {
  return (
    <Form {...form}>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email address and we&apos;ll send you instructions to reset your password.
        </p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
        {form.formState.errors.root && (
          <span
            className={
              form.formState.errors.root.type === 'success'
                ? 'text-[0.8rem] font-medium text-success'
                : 'text-[0.8rem] font-medium text-destructive'
            }
          >
            {form.formState.errors.root.message}
          </span>
        )}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Instructions
            </>
          ) : (
            'Send Reset Instructions'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Login
        </Button>
      </form>
    </Form>
  )
}
