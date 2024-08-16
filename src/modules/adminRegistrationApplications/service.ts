import http from '@/configs/axiosConfig'
import { ApiResponse } from './constants/types'

interface Search {
  page: number
  per_page: number
  sort: string | undefined
  status: string | undefined
}

interface RegisterApplicationForm {
  firstName: string
  lastName: string
  emailAddress: string
  city: string
  password: string
  phoneNumber: {
    countryCode: string
    lineNumber: string
  }
}

interface GetRegisterSummary {
  time: string
  isSuccess: boolean
  response: {
    id: string
    institution: {
      name: string
    }
  }
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

export const getAdminRegistrationApplication = (id: string) => {
  return http.get<ApiResponse>(`/api/v1/admin-registration-application/${id}`)
}

export const getAdminRegistrationApplicationSummary = (
  id: string,
): Promise<GetRegisterSummary> =>
  http.get(`/api/v1/admin-registration-application/${id}/summary`)

export const postRegistrationApplication = (
  id: string,
  form: RegisterApplicationForm,
) => http.post(`api/v1/admin-registration-application/${id}/complete`, form)
