import { z } from 'zod'
import i18n from '@/i18n'

const LoginFormSchema = z.object({
  emailAddress: z
    .string()
    .min(1, i18n.t('requiredField'))
    .email(i18n.t('invalidEmail')),
  password: z
    .string()
    .min(1, i18n.t('requiredField'))
    .min(6, i18n.t('minLength', { field: 6 }))
    .max(50, i18n.t('maxLength', { field: 50 })),
  sourcePage: z.string(),
})

export const FormValidationSchema = LoginFormSchema
