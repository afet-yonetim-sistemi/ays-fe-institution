import { FilterValidationOptions } from '@/common/types'
import { getStringFilterValidation } from '@/constants/filterValidationSchema'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFilterErrors = <T extends Record<string, any>>(
  filters: T,
  fieldsToValidate: (keyof T)[],
  validationRules?: Partial<Record<keyof T, FilterValidationOptions>>
): Record<string, string | null> => {
  const errors: Record<string, string | null> = {}

  for (const field of fieldsToValidate) {
    const value = filters[field]
    if (value !== undefined && value !== null && value !== '') {
      const rules = validationRules?.[field] ?? {}
      const stringValue = String(value)
      const result = getStringFilterValidation(rules).safeParse(stringValue)

      errors[field as string] = result.success
        ? null
        : result.error.errors[0]?.message
    } else {
      errors[field as string] = null
    }
  }

  return errors
}
