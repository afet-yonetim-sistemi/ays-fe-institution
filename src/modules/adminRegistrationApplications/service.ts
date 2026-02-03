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

import { mapAdminRegistrationApplicationFilterToApiRequest } from './utils/adminRegistrationApplicationFilterMapper'

export const getAdminRegistrationApplications = (
  filter: AdminRegistrationApplicationsFilter
): Promise<AxiosResponse> => {
  return http.post(
    '/api/institution/v1/admin-registration-applications',
    mapAdminRegistrationApplicationFilterToApiRequest(filter)
  )
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

export const createAdminRegistrationApplication = (
  data: object
): Promise<BaseApiResponse> => {
  return http
    .post(`/api/institution/v1/admin-registration-application`, data)
    .then((res) => res.data)
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
