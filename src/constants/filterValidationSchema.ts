import { FilterValidationOptions } from '@/common/types'
import { z } from 'zod'

export const getStringFilterValidation = ({
  min = 2,
  max = 100,
  regex,
  filterRegex,
  customRegexes,
}: FilterValidationOptions = {}): z.ZodOptional<z.ZodString> => {
  let schema = z
    .string()
    .min(min, { message: 'validation.minLength' })
    .max(max, { message: 'validation.maxLength' })

  const finalRegex = filterRegex || regex
  if (finalRegex) {
    schema = schema.regex(finalRegex, {
      message: 'validation.invalid',
    })
  }

  if (customRegexes) {
    customRegexes.forEach((customRegex) => {
      schema = schema.regex(customRegex.regex, {
        message: customRegex.message,
      })
    })
  }

  return schema.optional()
}
