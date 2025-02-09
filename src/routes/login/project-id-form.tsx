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
import { ProjectIdFormValues } from '@/types/auth'

interface ProjectIdFormProps {
  form: UseFormReturn<ProjectIdFormValues>
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: ProjectIdFormValues) => Promise<void>
  onBack: () => void
}

export const ProjectIdForm = ({ form, onSubmit, onBack }: ProjectIdFormProps) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
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
      {form.formState.errors.root && (
        <span className="text-[0.8rem] font-medium text-destructive">
          {form.formState.errors.root.message}
        </span>
      )}
      <Button type="submit" className="w-full mt-4" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Completing Registration
          </>
        ) : (
          'Complete Registration'
        )}
      </Button>
      <Button type="button" variant="outline" onClick={onBack} className="w-full mt-2">
        Back to Login
      </Button>
    </form>
  </Form>
)
