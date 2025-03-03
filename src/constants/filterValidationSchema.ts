import { z } from 'zod'
import { FilterValidationOptions } from '@/common/types'

export const getStringFilterValidation = ({
  min = 2,
  max = 100,
}: FilterValidationOptions = {}) => {
  const schema = z
    .string()
    .min(min, { message: 'minLength' })
    .max(max, { message: 'maxLength' })

  return schema.optional()
}
