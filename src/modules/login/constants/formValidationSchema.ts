import { PasswordSchema } from '@/constants/formValidationSchema'
import { emailFormRegex } from '@/constants/regex'
import { z } from 'zod'

const LoginFormSchema = z.object({
  emailAddress: z
    .string()
    .min(1, { message: 'validation.required' })
    .regex(emailFormRegex, { message: 'validation.email' })
    .min(6, { message: 'validation.minLength' })
    .max(254, { message: 'validation.maxLength' }),
  password: PasswordSchema,
  sourcePage: z.string(),
})

export const FormValidationSchema = LoginFormSchema
