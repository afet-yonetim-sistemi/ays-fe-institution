import { z } from 'zod'
import { emailRegex } from '@/constants/regex'
import { PasswordSchema } from '@/constants/formValidationSchema'

const LoginFormSchema = z.object({
  emailAddress: z
    .string({
      required_error: 'validation.required',
    })
    .regex(emailRegex, { message: 'validation.email' })
    .min(6, { message: 'validation.minLength' })
    .max(254, { message: 'validation.maxLength' }),
  password: PasswordSchema,
  sourcePage: z.string(),
})

export const FormValidationSchema = LoginFormSchema
