import { SearchParamType, Sort, SortDirection } from '@/common/types'

export type SearchParamValue = string | number | string[] | Sort[] | undefined

export type SearchParamsConfig<T extends Record<string, SearchParamValue>> = {
  [K in keyof T]: {
    type: SearchParamType
    defaultValue?: T[K]
    paramName?: string
  }
}

export function parseSearchParams<T extends Record<string, SearchParamValue>>(
  config: SearchParamsConfig<T>,
  searchParams: URLSearchParams
): { [K in keyof T]?: T[K] } & { page: number } {
  const result: Partial<T> = {}
  Object.entries(config).forEach(([key, conf]) => {
    if (!conf) return
    const { type, defaultValue, paramName } = conf
    const urlParamName = paramName ?? key
    const paramValue = searchParams.get(urlParamName)
    result[key as keyof T] = parseParamValue(
      type,
      paramValue,
      defaultValue
    ) as T[keyof T]
  })
  return {
    ...result,
    page: parseInt(searchParams.get('page') ?? '1', 10),
  }
}

function parseParamValue(
  type: SearchParamType,
  paramValue: string | null,
  defaultValue: SearchParamValue | undefined
): SearchParamValue | undefined {
  switch (type) {
    case SearchParamType.STRING:
      return paramValue ?? defaultValue ?? ''
    case SearchParamType.NUMBER:
      return paramValue ? parseInt(paramValue, 10) : (defaultValue ?? 0)
    case SearchParamType.ARRAY:
      return paramValue?.trim() ? paramValue.split(',') : (defaultValue ?? [])
    case SearchParamType.SORT:
      return paramValue?.trim()
        ? parseSortValue(paramValue)
        : (defaultValue ?? [])
    default:
      return paramValue ?? defaultValue
  }
}

function parseSortValue(paramValue: string): Sort[] {
  if (paramValue.includes(';')) {
    return paramValue.split(';').map((s) => {
      const [column, direction] = s.split(',')
      return { column, direction: direction as SortDirection }
    })
  } else {
    const [column, direction] = paramValue.split(',')
    return column ? [{ column, direction: direction as SortDirection }] : []
  }
}
