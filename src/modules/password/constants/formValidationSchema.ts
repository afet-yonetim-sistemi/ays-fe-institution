import { z } from 'zod'
import { t } from 'i18next'
import { PasswordSchema } from '@/constants/formValidationSchema'

export const FormValidationSchema = z
  .object({
    password: PasswordSchema,
    passwordRepeat: PasswordSchema,
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: t('passwordMismatch'),
    path: ['passwordRepeat'],
  })
