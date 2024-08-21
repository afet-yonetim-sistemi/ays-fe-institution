import { z } from 'zod'
import i18n from '@/i18n'

// Define the PhoneNumber schema
const PhoneNumberSchema = z.object({
  countryCode: z.string().min(1),
  lineNumber: z.string().min(1),
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

export const FormSchema = AdminRegistrationApplicationSchema

export const InstitutionFormSchema = z.object({
  firstName: z
    .string()
    .min(1, i18n.t('requiredField'))
    .min(3, i18n.t('minLength', { field: 3 }))
    .max(255, i18n.t('maxLength', { field: 255 })),
  lastName: z
    .string()
    .min(1, i18n.t('requiredField'))
    .min(3, i18n.t('minLength', { field: 3 }))
    .max(255, i18n.t('maxLength', { field: 255 })),
  emailAddress: z
    .string()
    .min(1, i18n.t('requiredField'))
    .email(i18n.t('invalidEmail')),
  city: z.string().min(1, i18n.t('requiredField')),
  password: z
    .string()
    .min(1, i18n.t('requiredField'))
    .min(8, i18n.t('minLength', { field: 8 }))
    .max(50, i18n.t('maxLength', { field: 50 })),
  phoneNumber: PhoneNumberSchema,
})
