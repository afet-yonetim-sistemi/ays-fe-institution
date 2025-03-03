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
      required_error: 'requiredField',
    })
    .min(minLength, { message: 'minLength' })
    .max(maxLength, { message: 'maxLength' })
    .refine(nameboxValidation, {
      message: 'notValidNamebox',
    })
