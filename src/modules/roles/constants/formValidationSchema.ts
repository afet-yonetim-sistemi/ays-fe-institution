import { z } from 'zod'

const RolesSchema = z.object({
  name: z.string(),
  status: z.string(),
  createdUser: z.string(),
  createdAt: z.string(),
  updatedUser: z.string(),
  updatedAt: z.string(),
})

export const FormValidationSchema = RolesSchema
