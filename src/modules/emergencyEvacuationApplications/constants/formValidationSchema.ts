import i18n from '@/i18n'
import { t } from 'i18next'
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
  hasObstaclePersonExist: z.boolean().default(false).optional(),
  notes: z
    .string()
    .max(1000, { message: t('maxLength', { field: 1000 }) })
    .refine((value) => !/^\s/.test(value), {
      message: t('cantStartOrEndWithWhitespace', {
        field: i18n.t('emergencyEvacuationApplications.notes'),
      }),
    })
    .refine((value) => !/\s$/.test(value), {
      message: t('cantStartOrEndWithWhitespace', {
        field: i18n.t('emergencyEvacuationApplications.notes'),
      }),
    })
    .optional(),
  createdUser: z.string(),
  createdAt: z.string(),
  updatedUser: z.string(),
  updatedAt: z.string(),
})

export const FormValidationSchema = EmergencyEvacuationApplicationSchema
