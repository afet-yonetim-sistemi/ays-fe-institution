export interface PhoneNumber {
  countryCode: string
  lineNumber: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  city: string
  emailAddress: string
  phoneNumber: PhoneNumber
}

export interface Institution {
  id: string
  name: string
}

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

export interface ApiResponse {
  time: string
  isSuccess: boolean
  response: AdminRegistrationApplication
}

export interface InstitutionsSummary {
  id: string
  name: string
}

export interface ApiSummaryResponse {
  time: string
  isSuccess: boolean
  data: { response: InstitutionsSummary[] }
}

export interface RegisterApplicationForm {
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

export interface GetRegisterSummary {
  time: string
  isSuccess: boolean
  response: {
    id: string
    institution: {
      name: string
    }
  }
}

export interface Search {
  page: number
  per_page: number
  sort: string | undefined
  status: string | undefined
}
