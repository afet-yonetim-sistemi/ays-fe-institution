import { FilterValidationOptions, SearchParamType } from '@/common/types'
import { COMMON_SEARCH_PARAMS } from '@/constants/commonSearchParams'
import { SearchParamsConfig } from '@/utils/searchParamsParser'
import { RolesFilter } from './types'

export const ROLE_FILTER_NAME_VALIDATION: FilterValidationOptions = {
  min: 2,
  max: 255,
  customRegexes: [
    {
      regex: /[\p{L}0-9]/u,
      message: 'validation.onlySpecialCharacters',
    },
    {
      regex: /^(?!.*[.,:;?!'"\-\(\)\[\]{}]{2}).*$/u,
      message: 'validation.consecutivePunctuation',
    },
    {
      regex: /^(?!.*[^\p{L}0-9\s.,:;?!'"\-\(\)\[\]{}]{2}).*$/u,
      message: 'validation.consecutiveSpecialCharacters',
    },
  ],
}

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
    name: ROLE_FILTER_NAME_VALIDATION,
  } as const,
} as const
