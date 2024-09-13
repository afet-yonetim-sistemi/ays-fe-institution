import { z } from 'zod'
import i18n from '@/i18n'

const PhoneNumberSchema = z.object({
  countryCode: z.string(),
  lineNumber: z.string(),
})

const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  city: z.string(),
  emailAddress: z.string(),
  phoneNumber: PhoneNumberSchema,
})

const InstitutionSchema = z.object({
  id: z.string(),
  name: z.string(),
})

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

export const PreApplicationFormSchema = z.object({
  institutionId: z.string().min(1, { message: i18n.t('requiredField') }),
  reason: z
    .string()
    .trim()
    .min(40, {
      message: i18n.t('minLength', { field: 40 }),
    })
    .refine((value) => !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(value), {
      message: i18n.t('notSpecialCharacters'),
    })
    .refine((value) => /[^0-9]+/.test(value), {
      message: i18n.t('notOnlyNumbers'),
    }),
})

export const FormValidationSchema = AdminRegistrationApplicationSchema
