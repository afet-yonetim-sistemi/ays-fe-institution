import { z } from 'zod'
import i18next from 'i18next'
// eslint-disable-next-line
export const getValidationSchema = (param: string) => {
  switch (param) {
    case 'seatingCount':
      return z
        .string()
        .optional()
        .refine((val) => !val || (/^\d{1,3}$/.test(val) && Number(val) > 0), {
          message: i18next.t('seatingCountValidationMessage', {
            field: 3,
          }),
        })
    case 'referenceNumber':
      return z
        .string()
        .optional()
        .refine((val) => !val || /^\d+$/.test(val), {
          message: i18next.t('referenceNumberValidationMessage'),
        })
    case 'name':
        return z
        .string()
        .optional()
        .refine((val) => !val || /^[a-zA-Z]+$/.test(val), {
          message: i18next.t('nameValidationMessage')
        })
    default:
      return z.string().optional()
  }
}
