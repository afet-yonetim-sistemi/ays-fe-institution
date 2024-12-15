import { emailRegex } from '@/constants/regex'
import i18n from '@/i18n'
import { nameboxWithLengthValidation } from '@/lib/nameboxValidation'
import { z } from 'zod'

const PhoneNumberSchema = z
  .object({
    countryCode: z.string(),
    lineNumber: z.string(),
  })
  .refine((phoneNumber) => phoneNumber.countryCode && phoneNumber.lineNumber, {
    message: i18n.t('invalidPhoneNumber'),
  })

export const CreateUserValidationSchema = z.object({
  firstName: nameboxWithLengthValidation('firstName', 2, 100),
  lastName: nameboxWithLengthValidation('lastName', 2, 100),
  emailAddress: z
    .string({
      required_error: i18n.t('requiredField', {
        field: i18n.t('emailAddress'),
      }),
    })
    .regex(emailRegex, i18n.t('invalidEmail')),
  phoneNumber: PhoneNumberSchema,
  city: z.string({
    required_error: i18n.t('requiredField', { field: i18n.t('city') }),
  }),
})
