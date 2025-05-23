import { z } from 'zod'
import { PhoneNumberSchema } from '@/constants/formValidationSchema'

const EmergencyEvacuationApplicationSchema = z.object({
  id: z.string(),
  referenceNumber: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: PhoneNumberSchema,
  sourceCity: z.string(),
  sourceDistrict: z.string(),
  address: z.string(),
  seatingCount: z
    .number({
      invalid_type_error: 'validation.number',
    })
    .int({
      message: 'validation.seatingCount',
    })
    .min(1, { message: 'validation.seatingCount' })
    .max(999, { message: 'validation.seatingCount' }),
  targetCity: z.string(),
  targetDistrict: z.string(),
  status: z.string(),
  applicantFirstName: z.string(),
  applicantLastName: z.string(),
  applicantPhoneNumber: PhoneNumberSchema,
  isInPerson: z.boolean(),
  hasObstaclePersonExist: z.boolean().default(false).optional(),
  notes: z
    .string()
    .max(1000, { message: 'validation.maxLength' })
    .refine((value) => !/\s$/.test(value), {
      message: 'validation.whitespace',
    })
    .optional(),
  createdUser: z.string(),
  createdAt: z.string(),
  updatedUser: z.string(),
  updatedAt: z.string(),
})

export const FormValidationSchema = EmergencyEvacuationApplicationSchema
