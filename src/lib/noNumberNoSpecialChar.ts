import i18n from '@/i18n'
import { z } from 'zod'

export const hasNoNumberNoSpecialChar = (str: string): boolean => {
  const strRegex = /^(?![^a-zA-ZÇçĞğİıÖöŞşÜü])[a-zA-ZÇçĞğİıÖöŞşÜü ,.'-]*$/
  return strRegex.test(str)
}

export const noNumberNoSpecialCharWithLengthValidation = (
  fieldName: string = 'thisField',
  minLength: number = 2,
  maxLength: number = 100
): z.ZodEffects<z.ZodString, string, string> =>
  z
    .string({
      required_error: i18n.t('requiredField', { field: i18n.t(fieldName) }),
    })
    .min(minLength, i18n.t('minLength', { field: minLength }))
    .max(maxLength, i18n.t('maxLength', { field: maxLength }))
    .refine(hasNoNumberNoSpecialChar, {
      message: i18n.t('noSpecialChar', { field: i18n.t(fieldName) }),
    })