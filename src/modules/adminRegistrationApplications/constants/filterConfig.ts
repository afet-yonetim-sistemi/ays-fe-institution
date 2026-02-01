import { COMMON_SEARCH_PARAMS } from '@/constants/commonSearchParams'
import { SearchParamsConfig } from '@/utils/searchParamsParser'
import { AdminRegistrationApplicationsFilter } from './types'

export const adminRegistrationApplicationsFilterConfig = {
  searchParams: {
    statuses: COMMON_SEARCH_PARAMS.STATUSES,
    sort: COMMON_SEARCH_PARAMS.SORT,
    page: COMMON_SEARCH_PARAMS.PAGE,
    pageSize: COMMON_SEARCH_PARAMS.PAGE_SIZE,
  } as SearchParamsConfig<AdminRegistrationApplicationsFilter>,

  defaultFilters: {
    page: 1,
    pageSize: 10,
    statuses: [],
    sort: [],
  } as AdminRegistrationApplicationsFilter,

  validationRules: {} as const,
} as const
