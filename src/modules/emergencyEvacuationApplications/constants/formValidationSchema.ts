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
      invalid_type_error:
        'emergencyEvacuationApplications.seatingCountinvalidType',
    })
    .int({
      message: 'seatingCountValidationMessage',
    })
    .min(1, { message: 'seatingCountValidationMessage' })
    .max(999, { message: 'seatingCountValidationMessage' }),
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
    .max(1000, { message: 'maxLength' })
    .refine((value) => !/^\s/.test(value), {
      message: 'validation.whitespace',
    })
    .optional(),
  createdUser: z.string(),
  createdAt: z.string(),
  updatedUser: z.string(),
  updatedAt: z.string(),
})

export const FormValidationSchema = EmergencyEvacuationApplicationSchema
