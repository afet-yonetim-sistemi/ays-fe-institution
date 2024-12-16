import { PhoneNumberSchema } from '@/constants/formValidationSchema'
import { z } from 'zod'

export const UserValidationSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: PhoneNumberSchema,
  city: z.string(),
  status: z.string(),
  createdUser: z.string(),
  createdAt: z.string(),
  updatedUser: z.string(),
  updatedAt: z.string(),
})
