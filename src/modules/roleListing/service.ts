import http from '@/configs/axiosConfig'
import { Search } from '../roleListing/constants/types'

export function postRoleListing(search: Search) {
  const sortBy = search.sort
    ? [
        {
          property: search.sort.split('.')[0],
          direction: search.sort.split('.')[1].toUpperCase(),
        },
      ]
    : []
  const filterStatus = search.status
    ? search.status?.toUpperCase().split(`.`)
    : []

  return http.post('/api/v1/roles', {
    pageable: {
      page: search.page,
      pageSize: search.per_page,
      orders: sortBy,
    },
    filter: {
      name: search.name,
      statuses: filterStatus,
    },
  })
}
