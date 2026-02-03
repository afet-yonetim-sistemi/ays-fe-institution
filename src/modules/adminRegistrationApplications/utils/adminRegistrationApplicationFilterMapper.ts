import { ApiRequest, Sort } from '@/common/types'
import {
  AdminRegistrationApplicationsFilter,
  AdminRegistrationApplicationsFilterParams,
} from '../constants/types'

export const mapAdminRegistrationApplicationFilterToApiRequest = (
  filter: AdminRegistrationApplicationsFilter
): ApiRequest<AdminRegistrationApplicationsFilterParams> => {
  let orders: Array<{ property: string; direction: string }> | undefined

  if (filter.sort && filter.sort.length > 0) {
    const validSortItems = filter.sort.filter(
      (item): item is Sort => item !== undefined
    )

    if (validSortItems.length > 0) {
      orders = validSortItems.map((sortItem) => ({
        property: sortItem?.column ?? '',
        direction: sortItem?.direction?.toUpperCase() ?? 'ASC',
      }))
    }
  }

  return {
    pageable: {
      page: filter.page || 1,
      pageSize: filter.pageSize || 10,
      ...(orders ? { orders } : {}),
    },
    filter: {
      ...(filter.statuses && filter.statuses.length > 0
        ? { statuses: filter.statuses }
        : {}),
    },
  }
}
