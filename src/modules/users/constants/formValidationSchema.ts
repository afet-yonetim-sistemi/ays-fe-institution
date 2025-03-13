import { z } from 'zod'
import { emailRegex } from '@/constants/regex'
import { nameboxWithLengthValidation } from '@/lib/nameboxValidation'
import { PhoneNumberSchema } from '@/constants/formValidationSchema'

export const UserValidationSchema = z.object({
  id: z.string(),
  firstName: nameboxWithLengthValidation(2, 100),
  lastName: nameboxWithLengthValidation(2, 100),
  emailAddress: z
    .string({
      required_error: 'validation.required',
    })
    .min(6, { message: 'validation.minLength' })
    .max(254, { message: 'validation.maxLength' })
    .regex(emailRegex, { message: 'validation.email' }),
  phoneNumber: PhoneNumberSchema,
  city: nameboxWithLengthValidation(2, 100),
  status: z.string(),
  createdUser: z.string(),
  createdAt: z.string(),
  updatedUser: z.string(),
  updatedAt: z.string(),
})

export const CreateUserValidationSchema = z.object({
  firstName: nameboxWithLengthValidation(2, 100),
  lastName: nameboxWithLengthValidation(2, 100),
  emailAddress: z
    .string({
      required_error: 'validation.required',
    })
    .min(6, { message: 'validation.minLength' })
    .max(254, { message: 'validation.maxLength' })
    .regex(emailRegex, { message: 'validation.email' }),
  phoneNumber: PhoneNumberSchema,
  city: nameboxWithLengthValidation(2, 100),
})
