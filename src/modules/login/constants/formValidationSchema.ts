import { z } from 'zod'
import i18n from '@/i18n'
import { emailRegex } from '@/constants/regex'
import { PasswordSchema } from '@/constants/formValidationSchema'

const LoginFormSchema = z.object({
  emailAddress: z
    .string({
      required_error: i18n.t('requiredField', {
        field: i18n.t('emailAddress'),
      }),
    })
    .regex(emailRegex, i18n.t('invalidEmail')),
  password: PasswordSchema,
  sourcePage: z.string(),
})

export const FormValidationSchema = LoginFormSchema
