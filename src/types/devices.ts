import { z } from 'zod'

export const deviceFormSchema = z.object({
  power_capacity: z
    .string()
    .min(1, 'Power capacity is required')
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 'Must be a positive number'),
})

export type DeviceFormValues = z.infer<typeof deviceFormSchema>
