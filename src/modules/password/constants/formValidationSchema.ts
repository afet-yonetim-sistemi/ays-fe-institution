import { z } from 'zod'
import i18n from '@/i18n'

const PasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, i18n.t('minLength', { field: 6 }))
      .max(50, i18n.t('maxLength', { field: 50 })),
    passwordRepeat: z
      .string()
      .min(6, i18n.t('minLength', { field: 6 }))
      .max(50, i18n.t('maxLength', { field: 50 })),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: i18n.t('passwordMismatch'),
    path: ['passwordRepeat'],
  })

export const FormValidationSchema = PasswordSchema
