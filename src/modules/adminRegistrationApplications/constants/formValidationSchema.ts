import {
  PasswordSchema,
  PhoneNumberSchema,
} from '@/constants/formValidationSchema'
import { emailRegex } from '@/constants/regex'
import { nameboxWithLengthValidation } from '@/lib/nameboxValidation'
import { z } from 'zod'

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
    message: 'validation.required',
  }),
  reason: z
    .string()
    .trim()
    .min(40, { message: 'minLength' })
    .max(512, { message: 'maxLength' })
    .refine((value) => !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(value), {
      message: 'notSpecialCharacters',
    })
    .refine((value) => /\D/.test(value), {
      message: 'notOnlyNumbers',
    }),
})

export const FormValidationSchema = AdminRegistrationApplicationSchema

export const InstitutionFormSchema = z.object({
  firstName: nameboxWithLengthValidation(2, 100),
  lastName: nameboxWithLengthValidation(2, 100),
  emailAddress: z
    .string({
      required_error: 'validation.required',
    })
    .min(6, { message: 'minLength' })
    .max(254, { message: 'maxLength' })
    .regex(emailRegex, { message: 'validation.email' }),
  city: z.string({
    required_error: 'validation.required',
  }),
  password: PasswordSchema,
  phoneNumber: PhoneNumberSchema,
})
