import { nameboxWithLengthValidation } from '@/lib/nameboxValidation'
import { z } from 'zod'

const RolesSchema = z.object({
  name: nameboxWithLengthValidation('role.name', 2, 255),
  status: z.string(),
  createdUser: z.string(),
  createdAt: z.string(),
  updatedUser: z.string(),
  updatedAt: z.string(),
})

export const CreateRoleSchema = z.object({
  name: nameboxWithLengthValidation('role.name', 2, 255),
})

export const FormValidationSchema = RolesSchema
