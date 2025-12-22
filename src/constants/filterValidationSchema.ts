import { FilterValidationOptions } from '@/common/types'
import { z } from 'zod'

export const getStringFilterValidation = ({
  min = 2,
  max = 100,
  regex,
}: FilterValidationOptions = {}) => {
  let schema = z
    .string()
    .min(min, { message: 'validation.minLength' })
    .max(max, { message: 'validation.maxLength' })

  if (regex) {
    schema = schema.regex(regex, {
      message: 'validation.invalid',
    })
  }

  return schema.optional()
}
