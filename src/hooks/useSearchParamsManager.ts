import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  parseSearchParams,
  SearchParamsConfig,
  SearchParamValue,
} from '@/utils/searchParamsParser'
import { getFilterErrors } from '@/lib/getFilterErrors'
import { FilterValidationOptions, SearchParamType } from '@/common/types'

interface UseSearchParamsManagerOptions<
  T extends Record<string, SearchParamValue>,
> {
  config: SearchParamsConfig<T>
  validationRules?: Partial<Record<keyof T, FilterValidationOptions>>
  defaultFilters: T
  onFiltersChange?: (filters: T) => void
}

export function useSearchParamsManager<
  T extends Record<string, SearchParamValue>,
>({
  config,
  validationRules = {},
  defaultFilters,
  onFiltersChange,
}: UseSearchParamsManagerOptions<T>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<T>(defaultFilters)
  const [filterErrors, setFilterErrors] = useState<
    Record<string, string | null>
  >({})
  const [inputValues, setInputValues] = useState<Record<string, string>>({})

  useEffect(() => {
    const initialInputs: Record<string, string> = {}
    Object.keys(config).forEach((key) => {
      if (config[key as keyof T]?.type === SearchParamType.STRING) {
        initialInputs[key] = (filters[key as keyof T] as string) ?? ''
      }
    })
    setInputValues(initialInputs)
  }, [config, filters])

  useEffect(() => {
    const paramsReady = searchParams.toString().length > 0
    if (!paramsReady) return

    const parsedParams = parseSearchParams(config, searchParams)
    const newFilters = { ...defaultFilters, ...parsedParams } as T

    let errors: Record<string, string | null> = {}
    if (Object.keys(validationRules).length > 0) {
      const validationFields = Object.keys(validationRules) as (keyof T)[]
      errors = getFilterErrors(newFilters, validationFields, validationRules)
    }

    setFilterErrors(errors)
    setFilters(newFilters)

    const newInputValues: Record<string, string> = {}
    Object.keys(config).forEach((key) => {
      if (config[key as keyof T]?.type === SearchParamType.STRING) {
        newInputValues[key] = (newFilters[key as keyof T] as string) ?? ''
      }
    })
    setInputValues((prev) => ({ ...prev, ...newInputValues }))

    const hasFilterErrors = Object.values(errors).some(
      (error) => error !== null
    )
    if (!hasFilterErrors && onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }, [searchParams, onFiltersChange, config, defaultFilters, validationRules])

  const handleFilterChange = useCallback(
    (key: string, value: string | string[] | boolean) => {
      const updatedParams = new URLSearchParams(searchParams)
      updatedParams.set('page', '1')

      const urlParamName = config[key as keyof T]?.paramName ?? key

      if (typeof value === 'boolean') {
        if (value) {
          updatedParams.set(urlParamName, 'true')
        } else {
          updatedParams.delete(urlParamName)
        }
      }

      if (Array.isArray(value)) {
        if (value.length > 0) {
          updatedParams.set(urlParamName, value.join(','))
        } else {
          updatedParams.delete(urlParamName)
        }
      }

      if (typeof value === 'string' && !Array.isArray(value)) {
        if (value.trim()) {
          updatedParams.set(urlParamName, value)
        } else {
          updatedParams.delete(urlParamName)
        }
      }

      window.history.pushState(
        null,
        '',
        `${pathname}?${updatedParams.toString()}`
      )
    },
    [pathname, searchParams, config]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      const updatedParams = new URLSearchParams(searchParams)
      updatedParams.set('page', page.toString())
      router.push(`${pathname}?${updatedParams.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const handleInputValueChange = useCallback((key: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  return {
    filters,
    filterErrors,
    inputValues,
    handleFilterChange,
    handlePageChange,
    handleInputValueChange,
  }
}
