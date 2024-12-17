import { PhoneNumberSchema } from '@/constants/formValidationSchema'
import { emailRegex } from '@/constants/regex'
import { nameboxWithLengthValidation } from '@/lib/nameboxValidation'
import { t } from 'i18next'
import { z } from 'zod'

const PhoneNumberSchemaWithRefine = PhoneNumberSchema.refine(
  (phoneNumber) => phoneNumber.countryCode && phoneNumber.lineNumber,
  {
    message: t('invalidPhoneNumber'),
  }
)

export const UserValidationSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: PhoneNumberSchemaWithRefine,
  city: z.string(),
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
    .regex(emailRegex, t('invalidEmail')),
  phoneNumber: PhoneNumberSchemaWithRefine,
  city: nameboxWithLengthValidation('city', 2, 100),
})
