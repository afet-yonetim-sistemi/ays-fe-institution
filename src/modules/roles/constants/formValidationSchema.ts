import { isAlphanumericWithTurkishChars } from '@/lib/isAlphanumericWithTurkishChars'
import { z } from 'zod'

// TODO add localization for messages
const RolesSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Role name must be at least 2 characters long' })
    .max(255, { message: 'Role name cannot exceed 255 characters' })
    .refine(isAlphanumericWithTurkishChars, {
      message: 'Role name cannot contain special characters',
    }),
  status: z.string(),
  createdUser: z.string(),
  createdAt: z.string(),
  updatedUser: z.string(),
  updatedAt: z.string(),
})

export const FormValidationSchema = RolesSchema
