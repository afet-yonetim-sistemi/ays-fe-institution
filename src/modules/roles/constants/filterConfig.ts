import { SearchParamType } from '@/common/types'
import { COMMON_SEARCH_PARAMS } from '@/constants/commonSearchParams'
import { COMMON_VALIDATION_RULES } from '@/constants/commonValidationRules'
import { SearchParamsConfig } from '@/utils/searchParamsParser'
import { RolesFilter } from './types'

export const rolesFilterConfig = {
  searchParams: {
    statuses: COMMON_SEARCH_PARAMS.STATUSES,
    name: {
      type: SearchParamType.STRING,
      defaultValue: '',
    },
    sort: COMMON_SEARCH_PARAMS.SORT,
    page: COMMON_SEARCH_PARAMS.PAGE,
    pageSize: COMMON_SEARCH_PARAMS.PAGE_SIZE,
  } as SearchParamsConfig<RolesFilter>,

  defaultFilters: {
    page: 1,
    pageSize: 10,
    statuses: [],
    name: '',
    sort: [],
  } as RolesFilter,

  validationRules: {
    name: COMMON_VALIDATION_RULES.NAME,
  } as const,
} as const
