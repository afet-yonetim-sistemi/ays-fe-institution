import { z } from 'zod'

export const nameboxValidation = (str: string): boolean => {
  const strRegex = /^(?![^a-zA-ZÇçĞğİıÖöŞşÜü])[a-zA-ZÇçĞğİıÖöŞşÜü ,.'-]*$/
  return strRegex.test(str)
}

export const nameboxWithLengthValidation = (
  minLength: number = 2,
  maxLength: number = 100
): z.ZodString =>
  z
    .string()
    .min(1, { message: 'validation.required' })
    .trim()
    .min(minLength, { message: 'validation.minLength' })
    .max(maxLength, { message: 'validation.maxLength' })
    .refine(nameboxValidation, {
      message: 'validation.invalid',
    })

export const strictNameValidation = z
  .string()
  .min(2, { message: 'validation.minLength' })
  .max(100, { message: 'validation.maxLength' })
  .regex(/^\p{L}(?:[\p{L} .'-]*\p{L})?$/u, {
    message: 'validation.invalid',
  })
  .refine((val) => !/ {2,}/.test(val), {
    message: 'validation.invalid',
  })
  .refine((val) => !/[.'-]{2,}/.test(val), {
    message: 'validation.invalid',
  })

export const roleNameValidation = z
  .string()
  .trim()
  .min(2, { message: 'validation.minLength' })
  .max(255, { message: 'validation.maxLength' })
  .regex(/^\p{L}(?:[\p{L}0-9 .'&|#\-,]*[\p{L}0-9])?$/u, {
    message: 'validation.invalid',
  })
  .refine((val) => !/[.'&|#\-,]{2,}/.test(val), {
    message: 'validation.invalid',
  })
