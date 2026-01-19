import { ApiRequest, PageableParams, Sort } from '@/common/types'
import { RoleFilterParams, RolesFilter } from '../constants/types'

type RolesApiRequest = ApiRequest<RoleFilterParams>

export const mapPageableParams = (filter: RolesFilter): PageableParams => {
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

export const mapFilterParams = (filter: RolesFilter): RoleFilterParams => {
  return {
    ...(filter.statuses.length > 0 ? { statuses: filter.statuses } : {}),
    ...(filter.name ? { name: String(filter.name) } : {}),
  }
}

export const mapRolesFilterToApiRequest = (
  filter: RolesFilter
): RolesApiRequest => ({
  pageable: mapPageableParams(filter),
  filter: mapFilterParams(filter),
})
