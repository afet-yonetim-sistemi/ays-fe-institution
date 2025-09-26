import { Sort, SortDirection } from '@/common/types'

export enum SearchParamType {
  STRING = 'string',
  NUMBER = 'number',
  ARRAY = 'array',
  SORT = 'sort',
}

export interface SearchParamsConfig {
  [key: string]: {
    type: SearchParamType
    defaultValue?: unknown
    paramName?: string
  }
}

export class SearchParamsParser {
  private readonly config: SearchParamsConfig

  constructor(config: SearchParamsConfig) {
    this.config = config
  }

  parse(searchParams: URLSearchParams): Record<string, unknown> {
    const result: Record<string, unknown> = {}

    result.page = parseInt(searchParams.get('page') ?? '1', 10)

    Object.entries(this.config).forEach(([key, config]) => {
      if (!config) return

      const { type, defaultValue, paramName } = config
      const urlParamName = paramName || key
      const paramValue = searchParams.get(urlParamName)

      result[key] = this.parseParamValue(type, paramValue, defaultValue)
    })

    return result
  }

  private parseParamValue(
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
          return this.parseSortValue(paramValue)
        }
        return defaultValue ?? []

      default:
        return paramValue ?? defaultValue
    }
  }

  private parseSortValue(paramValue: string): Sort[] {
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

  serialize(params: Record<string, unknown>): URLSearchParams {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return

      if (key === 'page') {
        const pageValue =
          typeof value === 'number' || typeof value === 'string'
            ? value.toString()
            : '1'
        searchParams.set('page', pageValue)
        return
      }

      const config = this.config[key]
      if (!config) return

      this.serializeParam(searchParams, config, key, value)
    })

    return searchParams
  }

  private serializeParam(
    searchParams: URLSearchParams,
    config: { type: SearchParamType; paramName?: string },
    key: string,
    value: unknown
  ): void {
    const urlParamName = config.paramName || key

    switch (config.type) {
      case SearchParamType.STRING:
      case SearchParamType.NUMBER:
        if (value !== '' && value !== 0) {
          const stringValue =
            typeof value === 'number' || typeof value === 'string'
              ? value.toString()
              : ''
          searchParams.set(urlParamName, stringValue)
        }
        break

      case SearchParamType.ARRAY:
        if (Array.isArray(value) && value.length > 0) {
          searchParams.set(urlParamName, value.join(','))
        }
        break

      case SearchParamType.SORT:
        if (Array.isArray(value) && value.length > 0) {
          const sortString = value
            .map((sort: Sort) => `${sort?.column},${sort?.direction}`)
            .join(';')
          searchParams.set(urlParamName, sortString)
        }
        break
    }
  }
}
