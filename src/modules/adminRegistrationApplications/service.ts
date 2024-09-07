import http from '@/configs/axiosConfig'
import { ApiResponse, ApiSummaryResponse } from './constants/types'
import { AxiosResponse } from 'axios'

interface Search {
  page: number
  per_page: number
  sort: string | undefined
  status: string | undefined
}
export function postAdminRegistrationApplications(
  search: Search
): Promise<AxiosResponse> {
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

export const getAdminRegistrationApplication = (
  id: string
): Promise<ApiResponse> => {
  return http
    .get<ApiResponse>(`/api/v1/admin-registration-application/${id}`)
    .then((response) => response.data)
}

export const getPreApplicationSummary = (): Promise<ApiSummaryResponse> => {
  return http.get(`/api/v1/institutions/summary`)
}

export const approveAdminRegistrationApplication = (
  data: object
): Promise<AxiosResponse> => {
  return http.post(`/api/v1/admin-registration-application`, data)
}

export const rejectAdminRegistrationApplication = (
  rejectReason: object,
  id: string
): Promise<ApiResponse> => {
  return http.post(
    `/api/v1/admin-registration-application/${id}/reject`,
    rejectReason
  )
}

export const approveAdminRegistrationApplicationWithId = (
  id: string
): Promise<ApiResponse> => {
  return http.post(`/api/v1/admin-registration-application/${id}/approve`)
}
