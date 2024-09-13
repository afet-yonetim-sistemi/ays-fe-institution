import { hasNoNumberNoSpecialChar } from '@/lib/hasNoNumberNoSpecialChar'
import { z } from 'zod'

// TODO add localization

const RolesSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Role name must be at least 2 characters long' })
    .max(255, { message: 'Role name cannot exceed 255 characters' })
    .refine(hasNoNumberNoSpecialChar, {
      message: 'Role name cannot contain special characters or numbers',
    }),
  status: z.string(),
  createdUser: z.string(),
  createdAt: z.string(),
  updatedUser: z.string(),
  updatedAt: z.string(),
})

export const FormValidationSchema = RolesSchema
