import { ApiRequest, PageableParams, Sort } from '@/common/types'
import { UserFilterParams, UsersFilter } from '../constants/types'

export const mapPageableParams = (filter: UsersFilter): PageableParams => {
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
    page: filter.page || 1,
    pageSize: filter.pageSize || 10,
    ...(orders ? { orders } : {}),
  }
}

export const mapFilterParams = (filter: UsersFilter): UserFilterParams => {
  const phoneNumber: { countryCode?: number; lineNumber?: string } = {}

  if (filter.countryCode) {
    phoneNumber.countryCode = filter.countryCode
  }
  if (filter.lineNumber) {
    phoneNumber.lineNumber = filter.lineNumber
  }

  return {
    ...(filter.statuses.length > 0 ? { statuses: filter.statuses } : {}),
    ...(filter.firstName ? { firstName: String(filter.firstName) } : {}),
    ...(filter.lastName ? { lastName: String(filter.lastName) } : {}),
    ...(filter.emailAddress
      ? { emailAddress: String(filter.emailAddress) }
      : {}),
    ...(filter.city ? { city: String(filter.city) } : {}),
    ...(Object.keys(phoneNumber).length > 0 ? { phoneNumber } : {}),
  }
}

export const mapUsersFilterToApiRequest = (
  filter: UsersFilter
): ApiRequest<UserFilterParams> => ({
  pageable: mapPageableParams(filter),
  filter: mapFilterParams(filter),
})
