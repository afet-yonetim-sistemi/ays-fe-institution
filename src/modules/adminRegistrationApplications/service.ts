import http from '@/configs/axiosConfig'
import { AxiosResponse } from 'axios'
import { ApiResponse } from './constants/types'

export const postAdminRegistrationApplications = (
  page: number,
  pageSize: number,
  statuses: string[],
  sortType: string,
) => {
  return http.post('/api/v1/admin-registration-applications', {
    pageable: {
      page: page,
      pageSize: pageSize,
    },
    filter: {
      statuses: statuses,
    },
    orders: [
      {
        property: 'createdAt',
        direction: sortType || 'ASC',
      },
    ],
  })
}

export const getAdminRegistrationApplication = async (
  id: string,
): Promise<AxiosResponse<ApiResponse>> => {
  return http.get<ApiResponse>(`/api/v1/admin-registration-application/${id}`)
}
