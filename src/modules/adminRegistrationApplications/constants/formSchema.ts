import { z } from 'zod'

const PhoneNumberSchema = z.object({
  countryCode: z.string(),
  lineNumber: z.string(),
})

const AdminRegistrationApplicationSchema = z.object({
  firstName: z.string().min(3).max(255),
  lastName: z.string().min(3).max(255),
  emailAddress: z.string().email(),
  city: z.string(),
  password: z.string().min(8).max(16),
  phoneNumber: PhoneNumberSchema,
})

export const FormSchema = AdminRegistrationApplicationSchema
