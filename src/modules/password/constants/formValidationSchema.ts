import { PasswordSchema } from '@/constants/formValidationSchema'
import { z } from 'zod'

export const FormValidationSchema = z
  .object({
    password: PasswordSchema,
    passwordRepeat: PasswordSchema,
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: 'password.create.mismatch',
    path: ['passwordRepeat'],
  })
