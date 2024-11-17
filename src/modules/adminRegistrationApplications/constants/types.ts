import { BaseApiResponse, Institution, PhoneNumber, User } from '@/common/types'

export interface AdminRegistrationApplication {
  id: string
  reason: string
  status: string
  institution: Institution
  createdUser: string
  createdAt: string
  updatedUser: string
  updatedAt: string
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

export interface AdminRegistrationApplicationsSearchParams {
  page: number
  per_page: number
  sort?: {
    column: string
    direction: 'asc' | 'desc' | null
  }
  statuses: string[]
}
