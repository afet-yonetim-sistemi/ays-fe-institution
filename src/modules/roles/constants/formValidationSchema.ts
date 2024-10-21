import { noNumberNoSpecialCharWithLengthValidation } from '@/lib/noNumberNoSpecialChar'
import { z } from 'zod'

const RolesSchema = z.object({
  name: noNumberNoSpecialCharWithLengthValidation('role.name', 2, 255),
  status: z.string(),
  createdUser: z.string(),
  createdAt: z.string(),
  updatedUser: z.string(),
  updatedAt: z.string(),
})

export const FormValidationSchema = RolesSchema
