import { z } from 'zod'

const PhoneNumberSchema = z.object({
  countryCode: z.string(),
  lineNumber: z.string(),
})

const EmergencyEvacuationApplicationSchema = z.object({
  id: z.string(),
  referenceNumber: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: PhoneNumberSchema,
  sourceCity: z.string(),
  sourceDistrict: z.string(),
  address: z.string(),
  seatingCount: z.number(),
  targetCity: z.string(),
  targetDistrict: z.string(),
  status: z.string(),
  applicantFirstName: z.string(),
  applicantLastName: z.string(),
  applicantPhoneNumber: PhoneNumberSchema,
  isInPerson: z.boolean(),
  hasObstaclePersonExist: z.boolean(),
  notes: z.string().nullable(),
  createdUser: z.string(),
  createdAt: z.string(),
  updatedUser: z.string(),
  updatedAt: z.string(),
})

export const FormSchema = EmergencyEvacuationApplicationSchema
