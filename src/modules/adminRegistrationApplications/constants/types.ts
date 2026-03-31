import {
  BaseApiResponse,
  Institution,
  PhoneNumber,
  Sort,
  User,
} from '@/common/types'
import { SearchParamValue } from '@/utils/searchParamsParser'
import { AdminRegistrationApplicationStatus } from './statuses'

export interface AdminRegistrationApplication {
  id: string
  reason: string
  status: AdminRegistrationApplicationStatus
  institution: Institution
  createdUser: string
  createdAt: string
  updatedUser: string | null
  updatedAt: string | null
  rejectReason: string | null
  user: User
}

export interface AdminApplicationApiResponse extends BaseApiResponse {
  response: AdminRegistrationApplication
}

export interface ApiSummaryResponse extends BaseApiResponse {
  data: { response: Institution[] }
}

export interface RegisterApplicationForm {
  firstName: string
  lastName: string
  emailAddress: string
  city: string
  password: string
  phoneNumber: PhoneNumber
}

export interface GetRegisterSummary extends BaseApiResponse {
  data: {
    response: {
      institution: {
        name: string
      }
    }
  }
}

export interface PreApplicationForm {
  institutionId: string
  reason: string
}

export interface AdminRegistrationApplicationsFilter extends Record<
  string,
  SearchParamValue
> {
  page: number
  pageSize: number
  sort?: Sort[]
  statuses: string[]
}

export interface AdminRegistrationApplicationsFilterParams {
  statuses?: string[]
}
