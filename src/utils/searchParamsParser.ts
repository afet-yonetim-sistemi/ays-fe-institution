import { SearchParamType, Sort, SortDirection } from '@/common/types'

export interface SearchParamsConfig {
  [key: string]: {
    type: SearchParamType
    defaultValue?: unknown
    paramName?: string
  }
}

export function parseSearchParams(
  config: SearchParamsConfig,
  searchParams: URLSearchParams
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  result.page = parseInt(searchParams.get('page') ?? '1', 10)
  Object.entries(config).forEach(([key, conf]) => {
    if (!conf) return
    const { type, defaultValue, paramName } = conf
    const urlParamName = paramName ?? key
    const paramValue = searchParams.get(urlParamName)
    result[key] = parseParamValue(type, paramValue, defaultValue)
  })
  return result
}

function parseParamValue(
  type: SearchParamType,
  paramValue: string | null,
  defaultValue: unknown
): unknown {
  switch (type) {
    case SearchParamType.STRING:
      return paramValue ?? defaultValue ?? ''
    case SearchParamType.NUMBER:
      return paramValue ? parseInt(paramValue, 10) : (defaultValue ?? 0)
    case SearchParamType.ARRAY:
      return paramValue?.trim() ? paramValue.split(',') : (defaultValue ?? [])
    case SearchParamType.SORT:
      if (paramValue?.trim()) {
        return parseSortValue(paramValue)
      }
      return defaultValue ?? []
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
