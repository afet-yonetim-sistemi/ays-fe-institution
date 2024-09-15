import { z } from 'zod'
import i18n from '@/i18n'

const PasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, i18n.t('requiredField'))
      .min(8, i18n.t('minLength', { field: 8 }))
      .max(50, i18n.t('maxLength', { field: 50 })),
    passwordRepeat: z
      .string()
      .min(1, i18n.t('requiredField'))
      .min(8, i18n.t('minLength', { field: 8 }))
      .max(50, i18n.t('maxLength', { field: 50 })),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: i18n.t('passwordMismatch'),
    path: ['passwordRepeat'],
  })

export const FormValidationSchema = PasswordSchema
