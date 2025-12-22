import React from 'react'

interface CreateFilterInputPropsOptions {
  handleInputValueChange: (key: string, value: string) => void
  debouncedHandleFilterChange: (key: string, value: string) => void
}

interface FilterInputPropsReturn {
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error: string | null | undefined
}

export const createFilterInputProps = <F extends Record<string, unknown>>(
  field: keyof F & string,
  inputValues: Record<string, string>,
  filterErrors: Record<string, string | null>,
  options: CreateFilterInputPropsOptions
): FilterInputPropsReturn => ({
  id: field,
  value: inputValues[field] || '',
  onChange: (e: React.ChangeEvent<HTMLInputElement>): void => {
    options.handleInputValueChange(field, e.target.value)
    options.debouncedHandleFilterChange(field, e.target.value)
  },
  error: filterErrors[field],
})
