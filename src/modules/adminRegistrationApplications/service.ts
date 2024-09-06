import http, { api } from '@/configs/axiosConfig'
import {
  ApiResponse,
  ApiSummaryResponse,
  CompleteRegistration,
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

export const getAdminRegistrationApplication = (
  id: string
): Promise<ApiResponse> => {
  return http
    .get(`/api/v1/admin-registration-application/${id}`)
    .then((res) => res.data)
}

export const getAdminRegistrationApplicationSummary = (
  id: string | null
): Promise<GetRegisterSummary> =>
  api.get(`/api/v1/admin-registration-application/${id}/summary`)

export const postRegistrationApplication = (
  id: string | null,
  form: RegisterApplicationForm
): Promise<CompleteRegistration> =>
  api.post(`api/v1/admin-registration-application/${id}/complete`, form)

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
