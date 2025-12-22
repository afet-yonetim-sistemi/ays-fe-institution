import { BaseApiResponse } from '@/common/types'
import http, { api } from '@/configs/axiosConfig'
import { AxiosResponse } from 'axios'
import {
  AdminApplicationApiResponse,
  AdminRegistrationApplicationsFilter,
  ApiSummaryResponse,
  GetRegisterSummary,
  RegisterApplicationForm,
} from './constants/types'

export const getAdminRegistrationApplications = (
  filter: AdminRegistrationApplicationsFilter
): Promise<AxiosResponse> => {
  const orders =
    filter.sort && filter.sort.length > 0
      ? filter.sort.map((sort) => ({
          property: sort?.column,
          direction: sort?.direction?.toUpperCase(),
        }))
      : undefined

  return http.post('/api/institution/v1/admin-registration-applications', {
    pageable: {
      page: filter.page || 1,
      pageSize: filter.pageSize || 10,
      ...(orders ? { orders } : []),
    },
    filter: {
      ...(filter.statuses.length > 0
        ? { statuses: filter.statuses }
        : undefined),
    },
  })
}

export const getAdminRegistrationApplication = async (
  id: string
): Promise<AdminApplicationApiResponse> => {
  return http
    .get(`/api/institution/v1/admin-registration-application/${id}`)
    .then((res) => res.data)
}

export const getAdminRegistrationApplicationSummary = (
  id: string | null
): Promise<GetRegisterSummary> =>
  api.get(`/api/institution/v1/admin-registration-application/${id}/summary`)

export const postRegistrationApplication = (
  id: string | null,
  form: RegisterApplicationForm
): Promise<BaseApiResponse> =>
  api.post(
    `/api/institution/v1/admin-registration-application/${id}/complete`,
    form
  )

export const getPreApplicationSummary = (): Promise<ApiSummaryResponse> => {
  return http.get(`/api/institution/v1/institutions/summary`)
}

export const approveAdminRegistrationApplication = (
  data: object
): Promise<AxiosResponse> => {
  return http.post(`/api/institution/v1/admin-registration-application`, data)
}

export const rejectAdminRegistrationApplication = (
  rejectReason: object,
  id: string
): Promise<AdminApplicationApiResponse> => {
  return http.post(
    `/api/institution/v1/admin-registration-application/${id}/reject`,
    rejectReason
  )
}

export const approveAdminRegistrationApplicationWithId = (
  id: string
): Promise<AdminApplicationApiResponse> => {
  return http.post(
    `/api/institution/v1/admin-registration-application/${id}/approve`
  )
}
