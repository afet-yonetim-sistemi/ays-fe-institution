import { z } from 'zod'
import i18n from '@/i18n'
import { FilterValidationOptions } from '@/common/types'

export const getStringFilterValidation = ({
  min = 2,
  max = 100,
}: FilterValidationOptions = {}) => {
  const schema = z
    .string()
    .min(min, { message: i18n.t('minLength', { field: min }) })
    .max(max, { message: i18n.t('maxLength', { field: max }) })

  return schema.optional()
}
