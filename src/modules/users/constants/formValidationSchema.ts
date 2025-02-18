import { z } from 'zod'
import { emailRegex } from '@/constants/regex'
import { nameboxWithLengthValidation } from '@/lib/nameboxValidation'
import { PhoneNumberSchema } from '@/constants/formValidationSchema'
import { t } from 'i18next'

export const UserValidationSchema = z.object({
  id: z.string(),
  firstName: nameboxWithLengthValidation('firstName', 2, 100),
  lastName: nameboxWithLengthValidation('lastName', 2, 100),
  emailAddress: z
    .string({
      required_error: t('requiredField', {
        field: t('emailAddress'),
      }),
    })
    .min(6, t('minLength', { field: 6 }))
    .max(50, t('maxLength', { field: 254 }))
    .regex(emailRegex, t('invalidEmail')),
  phoneNumber: z
    .string({
      required_error: t('requiredField', { field: t('phoneNumber') }),
    })
    .length(10, t('error.phoneNumberLengthError')),
  city: nameboxWithLengthValidation('city', 2, 100),
  status: z.string(),
  createdUser: z.string(),
  createdAt: z.string(),
  updatedUser: z.string(),
  updatedAt: z.string(),
})

export const CreateUserValidationSchema = z.object({
  firstName: nameboxWithLengthValidation('firstName', 2, 100),
  lastName: nameboxWithLengthValidation('lastName', 2, 100),
  emailAddress: z
    .string({
      required_error: t('requiredField', {
        field: t('emailAddress'),
      }),
    })
    .min(6, t('minLength', { field: 6 }))
    .max(50, t('maxLength', { field: 254 }))
    .regex(emailRegex, t('invalidEmail')),
  phoneNumber: PhoneNumberSchema,
  city: nameboxWithLengthValidation('city', 2, 100),
})
