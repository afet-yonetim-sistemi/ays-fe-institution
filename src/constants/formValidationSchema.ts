import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber'
import { z } from 'zod'

const phoneUtil = PhoneNumberUtil.getInstance()

export const PhoneNumberSchema = z
  .object({
    countryCode: z.string(),
    lineNumber: z.string(),
  })
  .superRefine(({ countryCode, lineNumber }, ctx) => {
    const fullNumber = `+${countryCode}${lineNumber}`

    try {
      const parsed = phoneUtil.parse(fullNumber)

      if (!phoneUtil.isValidNumber(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'validation.phone',
        })
      }

      const e164 = phoneUtil.format(parsed, PhoneNumberFormat.E164)
      const digitsOnly = e164.replace(/\D/g, '')

      if (digitsOnly.length !== 12) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'validation.phoneLength',
        })
      }
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'validation.phone',
      })
    }
  })

export const PasswordSchema = z
  .string({
    required_error: 'validation.required',
  })
  .min(8, { message: 'validation.minLength' })
  .max(128, { message: 'validation.maxLength' })
