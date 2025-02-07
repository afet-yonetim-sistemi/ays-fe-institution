import { t } from 'i18next'
import { z } from 'zod'

export const PhoneNumberSchema = z
  .object({
    countryCode: z.string(),
    lineNumber: z.string(),
  })
  .refine((phoneNumber) => phoneNumber.countryCode && phoneNumber.lineNumber, {
    message: t('invalidPhoneNumber'),
  })

export const PasswordSchema = z
  .string({
    required_error: t('requiredField', { field: t('password') }),
  })
  .min(8, t('minLength', { field: 8 }))
  .max(128, t('maxLength', { field: 128 }))
