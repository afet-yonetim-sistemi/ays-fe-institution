import { z } from 'zod'

const PhoneNumberSchema = z.object({
  countryCode: z.string(),
  lineNumber: z.string(),
})

const AdminRegistrationApplicationSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  emailAddress: z.string(),
  city: z.string(),
  password: z.string(),
  phoneNumber: PhoneNumberSchema,
})

export const FormSchema = AdminRegistrationApplicationSchema
