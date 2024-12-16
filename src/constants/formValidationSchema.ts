import { z } from 'zod'

export const PhoneNumberSchema = z.object({
  countryCode: z.string(),
  lineNumber: z.string(),
})
