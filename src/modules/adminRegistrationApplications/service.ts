import http from '@/configs/axiosConfig'
import {
  ApiResponse,
  GetRegisterSummary,
  RegisterApplicationForm,
  Search,
} from './constants/types'

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

export const getAdminRegistrationApplication = (id: string) => {
  return http.get<ApiResponse>(`/api/v1/admin-registration-application/${id}`)
}

export const getAdminRegistrationApplicationSummary = (
  id: string | null
): Promise<GetRegisterSummary> =>
  http.get(`/api/v1/admin-registration-application/${id}/summary`)

export const postRegistrationApplication = (
  id: string | null,
  form: RegisterApplicationForm
) => http.post(`api/v1/admin-registration-application/${id}/complete`, form)
