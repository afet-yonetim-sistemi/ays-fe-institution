import { BaseApiResponse, Institution, PhoneNumber, User } from '@/common/types'

export interface AdminRegistrationApplication {
  createdUser: string
  createdAt: string
  updatedUser: string
  updatedAt: string
  id: string
  reason: string
  rejectReason: string | null
  status: string
  institution: Institution
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

export interface Search {
  page: number
  per_page: number
  sort: string | undefined
  status: string | undefined
}
