import { isValidPhoneNumber } from 'libphonenumber-js'
import { z } from 'zod'

export const PhoneNumberSchema = z
  .object({
    countryCode: z.string(),
    lineNumber: z.string(),
  })
  .superRefine(({ countryCode, lineNumber }, ctx) => {
    const fullNumber = `${countryCode}${lineNumber}`

    if (!isValidPhoneNumber(fullNumber, 'TR')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'validation.phone',
      })
    }

    if (fullNumber.length !== 12) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'validation.phoneLength',
      })
    }
  })

export const PasswordSchema = z
  .string({
    required_error: 'validation.required',
  })
  .min(8, { message: 'validation.minLength' })
  .max(128, { message: 'validation.maxLength' })
