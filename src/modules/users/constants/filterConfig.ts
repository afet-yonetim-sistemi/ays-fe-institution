import { COMMON_VALIDATION_RULES } from '@/constants/commonValidationRules'
import { COMMON_SEARCH_PARAMS } from '@/constants/commonSearchParams'
import { UsersFilter } from './types'
import { SearchParamType } from '@/common/types'
import { SearchParamsConfig } from '@/utils/searchParamsParser'

export const usersFilterConfig = {
  searchParams: {
    statuses: COMMON_SEARCH_PARAMS.STATUSES,
    firstName: {
      type: SearchParamType.STRING,
      defaultValue: '',
    },
    lastName: {
      type: SearchParamType.STRING,
      defaultValue: '',
    },
    emailAddress: {
      type: SearchParamType.STRING,
      defaultValue: '',
    },
    lineNumber: {
      type: SearchParamType.STRING,
      defaultValue: '',
    },
    city: {
      type: SearchParamType.STRING,
      defaultValue: '',
    },
    sort: COMMON_SEARCH_PARAMS.SORT,
    page: COMMON_SEARCH_PARAMS.PAGE,
    pageSize: COMMON_SEARCH_PARAMS.PAGE_SIZE,
  } as SearchParamsConfig<UsersFilter>,

  defaultFilters: {
    page: 1,
    pageSize: 10,
    statuses: [],
    firstName: '',
    lastName: '',
    emailAddress: '',
    lineNumber: '',
    countryCode: undefined,
    city: '',
    sort: [],
  } as UsersFilter,

  validationRules: {
    firstName: COMMON_VALIDATION_RULES.NAME,
    lastName: COMMON_VALIDATION_RULES.NAME,
    emailAddress: COMMON_VALIDATION_RULES.EMAIL,
    lineNumber: {
      min: 0,
      max: 10,
    },
    city: COMMON_VALIDATION_RULES.CITY,
  } as const,
} as const
