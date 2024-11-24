import { z } from 'zod'
import i18n from '@/i18n'
import { emailRegex } from '@/constants/regex'

const LoginFormSchema = z.object({
  emailAddress: z
    .string({
      required_error: i18n.t('requiredField', {
        field: i18n.t('emailAddress'),
      }),
    })
    .regex(emailRegex, i18n.t('invalidEmail')),
  password: z
    .string({
      required_error: i18n.t('requiredField', { field: i18n.t('password') }),
    })
    .min(6, i18n.t('minLength', { field: 6 }))
    .max(50, i18n.t('maxLength', { field: 50 })),
  sourcePage: z.string(),
})

export const FormValidationSchema = LoginFormSchema
