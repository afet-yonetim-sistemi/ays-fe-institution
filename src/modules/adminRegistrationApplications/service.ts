import http from '@/configs/axiosConfig'
import {
  ApiResponse,
  ApiSummaryResponse,
  GetRegisterSummary,
  RegisterApplicationForm,
  Search,
} from './constants/types'
import { AxiosResponse } from 'axios'

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

//TODO: Add type for data
// eslint-disable-next-line
export const getAdminRegistrationApplication = (id: string) => {
  return http
    .get<ApiResponse>(`/api/v1/admin-registration-application/${id}`)
    .then((res) => res.data)
}

export const getAdminRegistrationApplicationSummary = (
  id: string | null
): Promise<GetRegisterSummary> =>
  http.get(`/api/v1/admin-registration-application/${id}/summary`)

//TODO: Add type for data
export const postRegistrationApplication = (
  id: string | null,
  form: RegisterApplicationForm
  // eslint-disable-next-line
) => http.post(`api/v1/admin-registration-application/${id}/complete`, form)

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
