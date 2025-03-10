import { z } from 'zod'

export const PhoneNumberSchema = z
  .object({
    countryCode: z.string(),
    lineNumber: z.string(),
  })
  .refine((phoneNumber) => phoneNumber.countryCode && phoneNumber.lineNumber, {
    message: 'validation.phone',
  })

export const PasswordSchema = z
  .string({
    required_error: 'validation.required',
  })
  .min(8, { message: 'validation.minLength' })
  .max(128, { message: 'validation.maxLength' })
