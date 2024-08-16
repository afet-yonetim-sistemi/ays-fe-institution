import { z } from 'zod'

// Define the PhoneNumber schema
const PhoneNumberSchema = z.object({
  countryCode: z.string(),
  lineNumber: z.string(),
})

// Define the User schema
const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  city: z.string(),
  emailAddress: z.string(),
  phoneNumber: PhoneNumberSchema,
})

// Define the Institution schema
const InstitutionSchema = z.object({
  id: z.string(),
  name: z.string(),
})

// Define the AdminRegistrationApplication schema
const AdminRegistrationApplicationSchema = z.object({
  createdUser: z.string(),
  createdAt: z.string(),
  updatedUser: z.string(),
  updatedAt: z.string(),
  id: z.string(),
  reason: z.string(),
  rejectReason: z.string().nullable(),
  status: z.string(),
  institution: InstitutionSchema,
  user: UserSchema,
})

const RegistrationCompletionSchema = z.object({
  firstName: z.string().min(3).max(255),
  lastName: z.string().min(3).max(255),
  emailAddress: z.string().email(),
  city: z.string(),
  password: z.string().min(8).max(16),
  phoneNumber: PhoneNumberSchema,
})

export const FormSchema = AdminRegistrationApplicationSchema

export const InstitutionFormSchema = RegistrationCompletionSchema
