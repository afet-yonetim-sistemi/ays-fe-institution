import { z } from 'zod'
import i18n from '@/i18n'
import { nameboxWithLengthValidation } from '@/lib/nameboxValidation'
import { emailRegex } from '@/constants/regex'
import {
  PasswordSchema,
  PhoneNumberSchema,
} from '@/constants/formValidationSchema'

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
  institutionId: z.string().min(1, {
    message: i18n.t('requiredField', {
      field: i18n.t('institution'),
    }),
  }),
  reason: z
    .string()
    .trim()
    .min(40, {
      message: i18n.t('minLength', { field: 40 }),
    })
    .max(512, {
      message: i18n.t('maxLength', { field: 512 }),
    })
    .refine((value) => !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(value), {
      message: i18n.t('notSpecialCharacters'),
    })
    .refine((value) => /\D/.test(value), {
      message: i18n.t('notOnlyNumbers'),
    }),
})

export const FormValidationSchema = AdminRegistrationApplicationSchema

export const InstitutionFormSchema = z.object({
  firstName: nameboxWithLengthValidation('firstName', 2, 100),
  lastName: nameboxWithLengthValidation('lastName', 2, 100),
  emailAddress: z
    .string({
      required_error: i18n.t('requiredField', {
        field: i18n.t('emailAddress'),
      }),
    })
    .regex(emailRegex, i18n.t('invalidEmail')),
  city: z.string({
    required_error: i18n.t('requiredField', { field: i18n.t('city') }),
  }),
  password: PasswordSchema,
  phoneNumber: PhoneNumberSchema,
})
