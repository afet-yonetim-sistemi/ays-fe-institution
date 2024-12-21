import http from '@/configs/axiosConfig'
import { AxiosResponse } from 'axios'
import {
  CreateUserPayload,
  UserApiResponse,
  UsersFilter,
} from './constants/types'
import { BaseApiResponse } from '@/common/types'

export const getUsers = (filter: UsersFilter): Promise<AxiosResponse> => {
  const orders = filter.sort?.length
    ? filter.sort.map((sortItem) => ({
        property: sortItem?.column,
        direction: sortItem?.direction?.toUpperCase(),
      }))
    : undefined

  const phoneNumber = {
    ...(filter.countryCode ? { countryCode: filter.countryCode } : {}),
    ...(filter.lineNumber ? { lineNumber: filter.lineNumber } : {}),
  }

  return http.post('/api/v1/users', {
    pageable: {
      page: filter.page || 1,
      pageSize: filter.pageSize || 10,
      ...(orders ? { orders } : []),
    },
    filter: {
      ...(filter.statuses.length > 0
        ? { statuses: filter.statuses }
        : undefined),
      firstName: filter.firstName || undefined,
      lastName: filter.lastName || undefined,
      emailAddress: filter.emailAddress || undefined,
      city: filter.city || undefined,
      ...(Object.keys(phoneNumber).length > 0 ? { phoneNumber } : undefined),
    },
  })
}

export const getUser = async (id: string): Promise<UserApiResponse> => {
  return http
    .get<UserApiResponse>(`/api/v1/user/${id}`)
    .then((response) => response.data)
}

export const createUser = async (
  data: CreateUserPayload
): Promise<BaseApiResponse> => {
  return http.post('/api/v1/user', data).then((response) => response.data)
}

export const activateUser = async (id: string): Promise<BaseApiResponse> => {
  return http
    .patch(`/api/v1/user/${id}/activate`)
    .then((response) => response.data)
}
