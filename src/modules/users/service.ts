import http from '@/configs/axiosConfig'
import { AxiosResponse } from 'axios'
import { UsersFilter } from './constants/types'

export const getUsers = (filter: UsersFilter): Promise<AxiosResponse> => {
  // const sortBy = filter.sort?.direction
  //   ? [
  //       {
  //         property: filter.sort.column,
  //         direction: filter.sort.direction.toUpperCase(),
  //       },
  //     ]
  //   : undefined

  return http.post('/api/v1/users', {
    pageable: {
      page: filter.page || 1,
      pageSize: filter.pageSize || 10,
      // ...(sortBy ? { orders: sortBy } : {}),
    },
    filter: {
      ...(filter.statuses.length > 0
        ? { statuses: filter.statuses }
        : undefined),
      firstName: filter.firstName || undefined,
      lastName: filter.lastName || undefined,
      emailAddress: filter.emailAddress || undefined,
      // phoneNumber: filter.phoneNumber ?? undefined,
      city: filter.city || undefined,
    },
  })
}
