import { SearchParamType, Sort } from '@/common/types'

export const COMMON_SEARCH_PARAMS = {
  STATUSES: {
    type: SearchParamType.ARRAY,
    defaultValue: [] as string[],
    paramName: 'status',
  },
  SORT: {
    type: SearchParamType.SORT,
    defaultValue: [] as Sort[],
  },
  PAGE: {
    type: SearchParamType.NUMBER,
    defaultValue: 1,
  },
  PAGE_SIZE: {
    type: SearchParamType.NUMBER,
    defaultValue: 10,
  },
} as const
