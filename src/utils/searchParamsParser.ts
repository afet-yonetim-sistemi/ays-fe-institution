import { Sort } from '@/common/types'

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
  private config: SearchParamsConfig

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

      switch (type) {
        case SearchParamType.STRING:
          result[key] = paramValue ?? (defaultValue || '')
          break

        case SearchParamType.NUMBER:
          result[key] = paramValue
            ? parseInt(paramValue, 10)
            : defaultValue || 0
          break

        case SearchParamType.ARRAY:
          result[key] = paramValue?.trim()
            ? paramValue.split(',')
            : defaultValue || []
          break

        case SearchParamType.SORT:
          if (paramValue?.trim()) {
            if (paramValue.includes(';')) {
              result[key] = paramValue.split(';').map((s) => {
                const [column, direction] = s.split(',')
                return { column, direction }
              }) as Sort[]
            } else {
              const [column, direction] = paramValue.split(',')
              result[key] = column ? [{ column, direction }] : []
            }
          } else {
            result[key] = defaultValue || []
          }
          break

        default:
          result[key] = paramValue ?? defaultValue
      }
    })

    return result
  }

  serialize(params: Record<string, unknown>): URLSearchParams {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return

      if (key === 'page') {
        searchParams.set('page', value.toString())
        return
      }

      const config = this.config[key]
      if (!config) return

      const urlParamName = config.paramName || key

      switch (config.type) {
        case SearchParamType.STRING:
        case SearchParamType.NUMBER:
          if (value !== '' && value !== 0) {
            searchParams.set(urlParamName, value.toString())
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
    })

    return searchParams
  }
}
