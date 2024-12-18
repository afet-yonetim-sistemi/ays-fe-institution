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
