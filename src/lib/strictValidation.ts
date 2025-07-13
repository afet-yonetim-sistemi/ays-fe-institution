import { z } from 'zod'

export const nameboxValidation = (str: string): boolean => {
  const strRegex = /^(?![^a-zA-ZÇçĞğİıÖöŞşÜü])[a-zA-ZÇçĞğİıÖöŞşÜü ,.'-]*$/
  return strRegex.test(str)
}

export const nameboxWithLengthValidation = (
  minLength: number = 2,
  maxLength: number = 100
): z.ZodEffects<z.ZodString, string, string> =>
  z
    .string({
      required_error: 'validation.required',
    })
    .min(minLength, { message: 'validation.minLength' })
    .max(maxLength, { message: 'validation.maxLength' })
    .refine(nameboxValidation, {
      message: 'validation.invalid',
    })

export const strictNameValidation = z
  .string()
  .min(2, { message: 'validation.minLength' })
  .max(100, { message: 'validation.maxLength' })
  .regex(/^\p{L}(?:[\p{L}\s.,'\-]*\p{L})?$/u, {
    message: 'validation.invalid',
  })
  .refine((val) => !/ {2,}/.test(val), {
    message: 'validation.invalid',
  })
  .refine((val) => !/[.,'\-]{2,}/.test(val), {
    message: 'validation.invalid',
  })
