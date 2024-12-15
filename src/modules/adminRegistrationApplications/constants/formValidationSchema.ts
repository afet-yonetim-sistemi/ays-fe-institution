import { z } from 'zod'
import i18n from '@/i18n'
import { nameboxWithLengthValidation } from '@/lib/nameboxValidation'
import { emailRegex } from '@/constants/regex'
import { PhoneNumberSchema } from '@/constants/formValidationSchema'

const PhoneNumberSchemaWithRefine = PhoneNumberSchema.refine(
  (phoneNumber) => phoneNumber.countryCode && phoneNumber.lineNumber,
  {
    message: i18n.t('invalidPhoneNumber'),
  }
)

const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  city: z.string(),
  emailAddress: z.string(),
  phoneNumber: PhoneNumberSchemaWithRefine,
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
  password: z
    .string({
      required_error: i18n.t('requiredField', { field: i18n.t('password') }),
    })
    .min(6, i18n.t('minLength', { field: 6 }))
    .max(50, i18n.t('maxLength', { field: 50 })),
  phoneNumber: PhoneNumberSchemaWithRefine,
})
