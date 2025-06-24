import { z } from 'zod'

const roleNameSchema = z
  .string()
  .min(2, { message: 'validation.minLength' })
  .max(255, { message: 'validation.maxLength' })
  .regex(/^\p{L}/u, {
    message: 'validation.invalid',
  })
  .regex(/^\S(?:.*\S)?$/u, {
    message: 'validation.invalid',
  })
  .refine((val) => !/\d/.test(val), {
    message: 'validation.invalid',
  })

const RolesSchema = z.object({
  name: roleNameSchema,
  status: z.string(),
  createdUser: z.string(),
  createdAt: z.string(),
  updatedUser: z.string(),
  updatedAt: z.string(),
})

export const CreateRoleSchema = z.object({
  name: roleNameSchema,
})

export const FormValidationSchema = RolesSchema
