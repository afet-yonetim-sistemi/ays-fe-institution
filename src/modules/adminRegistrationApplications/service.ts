import http from '@/configs/axiosConfig'
import { AxiosResponse } from 'axios'
import { ApiResponse } from './constants/types'

interface Search {
  page: number
  per_page: number
  sort: string | undefined
  status: string | undefined
}
export function postAdminRegistrationApplications(search: Search) {
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

  return http.post('/api/v1/admin-registration-applications', {
    pageable: {
      page: search?.page || 1,
      pageSize: search.per_page,
      orders: sortBy,
    },
    filter: {
      statuses: filterStatus,
    },
  })
}

export const getAdminRegistrationApplication = async (
  id: string,
): Promise<AxiosResponse<ApiResponse>> => {
  return http.get<ApiResponse>(`/api/v1/admin-registration-application/${id}`)
}
