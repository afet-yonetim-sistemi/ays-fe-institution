import http, { api } from '@/configs/axiosConfig'
import {
  AdminApplicationApiResponse,
  ApiSummaryResponse,
  GetRegisterSummary,
  RegisterApplicationForm,
  AdminRegistrationApplicationsSearchParams,
} from './constants/types'
import { AxiosResponse } from 'axios'
import { BaseApiResponse } from '@/common/types'

export const getAdminRegistrationApplications = (
  search: AdminRegistrationApplicationsSearchParams
): Promise<AxiosResponse> => {
  const sortBy = search.sort?.direction
    ? [
        {
          property: search.sort.column,
          direction: search.sort.direction.toUpperCase(),
        },
      ]
    : undefined

  return http.post('/api/v1/admin-registration-applications', {
    pageable: {
      page: search.page || 1,
      pageSize: search.per_page || 10,
      ...(sortBy ? { orders: sortBy } : {}),
    },
    filter: {
      statuses: search.statuses,
    },
  })
}

export const getAdminRegistrationApplication = async (
  id: string
): Promise<AdminApplicationApiResponse> => {
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
): Promise<BaseApiResponse> =>
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
): Promise<AdminApplicationApiResponse> => {
  return http.post(
    `/api/v1/admin-registration-application/${id}/reject`,
    rejectReason
  )
}

export const approveAdminRegistrationApplicationWithId = (
  id: string
): Promise<AdminApplicationApiResponse> => {
  return http.post(`/api/v1/admin-registration-application/${id}/approve`)
}
