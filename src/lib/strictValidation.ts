import { COMMON_VALIDATION_RULES } from '@/constants/commonValidationRules'
import { z } from 'zod'

export const nameboxValidation = (str: string): boolean => {
  return COMMON_VALIDATION_RULES.NAME.formRegex.test(str)
}

export const nameboxWithLengthValidation = (
  minLength: number = COMMON_VALIDATION_RULES.NAME.min,
  maxLength: number = COMMON_VALIDATION_RULES.NAME.max
): z.ZodString =>
  z
    .string()
    .min(1, { message: 'validation.required' })
    .min(minLength, { message: 'validation.minLength' })
    .max(maxLength, { message: 'validation.maxLength' })
    .refine(nameboxValidation, {
      message: 'validation.invalid',
    })

export const strictNameValidation = nameboxWithLengthValidation()

export const roleNameValidation = z
  .string()
  .trim()
  .min(1, { message: 'validation.required' })
  .min(2, { message: 'validation.minLength' })
  .max(255, { message: 'validation.maxLength' })
  .regex(/^\p{L}(?:[\p{L}0-9 .'&|#\-,/_]*[\p{L}0-9])?$/u, {
    message: 'validation.invalid',
  })
  .refine((val) => !/[.'&|#\-,/_]{2,}/.test(val), {
    message: 'validation.invalid',
  })
