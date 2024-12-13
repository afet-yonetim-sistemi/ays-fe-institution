import { t } from 'i18next'
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
  seatingCount: z
    .number({
      invalid_type_error: t(
        'emergencyEvacuationApplications.seatingCountinvalidType'
      ),
    })
    .int({
      message: t('seatingCountValidationMessage', {
        field: 3,
      }),
    })
    .min(1, { message: t('seatingCountValidationMessage', { field: 3 }) })
    .max(999, { message: t('seatingCountValidationMessage', { field: 3 }) }),
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

export const FormValidationSchema = EmergencyEvacuationApplicationSchema
