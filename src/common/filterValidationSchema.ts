// wrong, old, broken validations to use in prod
// do not touch this file without talking with agit

import i18next from 'i18next'
import { z } from 'zod'

export const FilterValidationSchemas = {
  seatingCount: z
    .string()
    .optional()
    .refine((val) => !val || (/^\d{1,3}$/.test(val) && Number(val) > 0), {
      message: i18next.t('seatingCountValidationMessage', { field: 3 }),
    }),

  referenceNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: i18next.t('referenceNumberValidationMessage'),
    }),

  name: z
    .string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z]+$/.test(val), {
      message: i18next.t('nameValidationMessage'),
    }),
}
