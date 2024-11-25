import { z } from 'zod'
import i18n from '@/i18n'

export const getStringFilterValidation = () =>
  z
    .string()
    .min(2, { message: i18n.t('minLength', { field: 2 }) })
    .max(100, { message: i18n.t('maxLength', { field: 100 }) })
    .optional()
