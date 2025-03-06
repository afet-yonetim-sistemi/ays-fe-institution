import { z } from 'zod'

export const PhoneNumberSchema = z
  .object({
    countryCode: z.string(),
    lineNumber: z.string(),
  })
  .refine((phoneNumber) => phoneNumber.countryCode && phoneNumber.lineNumber, {
    message: 'invalidPhoneNumber',
  })

export const PasswordSchema = z
  .string({
    required_error: 'validation.required',
  })
  .min(8, { message: 'minLength' })
  .max(128, { message: 'maxLength' })
