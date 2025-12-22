import { FilterValidationOptions, SearchParamType } from '@/common/types'
import { getFilterErrors } from '@/lib/getFilterErrors'
import {
  parseSearchParams,
  SearchParamsConfig,
  SearchParamValue,
} from '@/utils/searchParamsParser'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

interface UseSearchParamsManagerOptions<
  T extends Record<string, SearchParamValue>,
> {
  config: SearchParamsConfig<T>
  validationRules?: Partial<Record<keyof T, FilterValidationOptions>>
  defaultFilters: T
  onFiltersChange?: (filters: T) => void
}

interface UseSearchParamsManagerReturn<
  T extends Record<string, SearchParamValue>,
> {
  filters: T
  filterErrors: Record<string, string | null>
  hasFilterErrors: boolean
  inputValues: Record<string, string>
  handleFilterChange: (key: string, value: string | string[] | boolean) => void
  handlePageChange: (page: number) => void
  handleInputValueChange: (key: string, value: string) => void
  getFilterInputProps: (field: keyof T & string) => {
    id: string
    value: string
    error: string | null
    onValueChange: (value: string) => void
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  }
}

export function useSearchParamsManager<
  T extends Record<string, SearchParamValue>,
>({
  config,
  validationRules = {},
  defaultFilters,
}: UseSearchParamsManagerOptions<T>): UseSearchParamsManagerReturn<T> {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<T>(() => {
    if (searchParams.toString().length > 0) {
      const parsedParams = parseSearchParams(config, searchParams)
      return { ...defaultFilters, ...parsedParams } as T
    }
    return defaultFilters
  })

  const [filterErrors, setFilterErrors] = useState<
    Record<string, string | null>
  >(() => {
    if (
      searchParams.toString().length > 0 &&
      Object.keys(validationRules).length > 0
    ) {
      const parsedParams = parseSearchParams(config, searchParams)
      const initialFilters = { ...defaultFilters, ...parsedParams } as T
      const validationFields = Object.keys(validationRules) as (keyof T)[]
      return getFilterErrors(initialFilters, validationFields, validationRules)
    }
    return {}
  })

  const [inputValues, setInputValues] = useState<Record<string, string>>(() => {
    const initialInputs: Record<string, string> = {}
    if (searchParams.toString().length > 0) {
      const parsedParams = parseSearchParams(config, searchParams)
      const initialFilters = { ...defaultFilters, ...parsedParams } as T
      Object.keys(config).forEach((key) => {
        if (config[key as keyof T]?.type === SearchParamType.STRING) {
          initialInputs[key] = (initialFilters[key as keyof T] as string) ?? ''
        }
      })
    }
    return initialInputs
  })

  useEffect(() => {
    const paramsReady = searchParams.toString().length > 0
    if (!paramsReady) return

    const parsedParams = parseSearchParams(config, searchParams)
    const newFilters = { ...defaultFilters, ...parsedParams } as T

    if (
      'page' in newFilters &&
      typeof newFilters.page === 'number' &&
      newFilters.page <= 0
    ) {
      const updatedParams = new URLSearchParams(searchParams)
      updatedParams.set('page', '1')
      router.replace(`${pathname}?${updatedParams.toString()}`)
      return
    }

    let errors: Record<string, string | null> = {}
    if (Object.keys(validationRules).length > 0) {
      const validationFields = Object.keys(validationRules) as (keyof T)[]
      errors = getFilterErrors(newFilters, validationFields, validationRules)
    }

    const newInputValues: Record<string, string> = {}
    Object.keys(config).forEach((key) => {
      if (config[key as keyof T]?.type === SearchParamType.STRING) {
        newInputValues[key] = (newFilters[key as keyof T] as string) ?? ''
      }
    })

    startTransition(() => {
      setFilterErrors(errors)
      setFilters(newFilters)
      setInputValues((prev) => ({ ...prev, ...newInputValues }))
    })
  }, [
    searchParams,
    config,
    defaultFilters,
    validationRules,
    router,
    pathname,
    setFilterErrors,
  ])

  const hasFilterErrors = useMemo(
    () => Object.values(filterErrors).some((error) => error !== null),
    [filterErrors]
  )

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

      router.push(`${pathname}?${updatedParams.toString()}`)
    },
    [router, pathname, searchParams, config]
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

  const getFilterInputProps = useCallback(
    (
      field: keyof T & string
    ): {
      id: string
      value: string
      error: string | null
      onValueChange: (value: string) => void
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    } => ({
      id: field,
      value: inputValues[field] ?? '',
      error: filterErrors[field] ?? null,
      onValueChange: (value: string): void =>
        handleInputValueChange(field, value),
      onChange: (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value
        handleInputValueChange(field, value)
        handleFilterChange(field, value)
      },
    }),
    [inputValues, filterErrors, handleInputValueChange, handleFilterChange]
  )

  return {
    filters,
    filterErrors,
    hasFilterErrors,
    inputValues,
    handleFilterChange,
    handlePageChange,
    handleInputValueChange,
    getFilterInputProps,
  }
}
