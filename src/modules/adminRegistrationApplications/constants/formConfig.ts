import {
  PasswordSchema,
  PhoneNumberSchema,
} from '@/constants/formValidationSchema'
import { emailRegex } from '@/constants/regex'
import { nameboxWithLengthValidation } from '@/lib/strictValidation'
import { z } from 'zod'
import { PreApplicationForm } from './types'

export const adminRegistrationApplicationFormConfig = {
  fields: {
    institutionId: {
      name: 'institutionId',
      label: 'common.institution',
      required: true,
    },
    reason: {
      name: 'reason',
      label: 'application.admin.preliminary.reason',
      required: true,
    },
  },

  preApplicationValidationSchema: z.object({
    institutionId: z.string().min(1, {
      message: 'validation.required',
    }),
    reason: z
      .string()
      .trim()
      .min(40, { message: 'validation.minLength' })
      .max(512, { message: 'validation.maxLength' })
      .refine((value) => !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(value), {
        message: 'validation.specialChar',
      })
      .refine((value) => /\D/.test(value), {
        message: 'validation.noNumbersOnly',
      }),
  }),

  completeApplicationValidationSchema: z.object({
    firstName: nameboxWithLengthValidation(2, 100),
    lastName: nameboxWithLengthValidation(2, 100),
    emailAddress: z
      .string({
        required_error: 'validation.required',
      })
      .min(6, { message: 'validation.minLength' })
      .max(254, { message: 'validation.maxLength' })
      .regex(emailRegex, { message: 'validation.email' }),
    city: z.string({
      required_error: 'validation.required',
    }),
    password: PasswordSchema,
    phoneNumber: PhoneNumberSchema,
  }),

  detailsValidationSchema: z.object({
    createdUser: z.string().optional(),
    createdAt: z.string().optional(),
    updatedUser: z.string().optional(),
    updatedAt: z.string().optional(),
    id: z.string().optional(),
    reason: z.string().optional(),
    rejectReason: z.string().nullable().optional(),
    status: z.string().optional(),
    institution: z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .optional(),
    user: z
      .object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        city: z.string(),
        emailAddress: z.string(),
        phoneNumber: PhoneNumberSchema,
      })
      .optional(),
  }),

  getPreApplicationDefaultValues: (): PreApplicationForm => ({
    institutionId: '',
    reason: '',
  }),
} as const
