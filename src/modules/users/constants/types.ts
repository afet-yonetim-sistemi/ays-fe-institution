import { BaseApiResponse, PhoneNumber, Sort } from '@/common/types'

export interface UsersFilter {
  page: number
  pageSize: number
  sort?: Sort[]
  statuses: string[]
  firstName?: string
  lastName?: string
  emailAddress?: string
  countryCode?: number
  lineNumber?: number
  city?: string
}

export interface UserRole {
  id: string
  name: string
}

export interface User {
  createdUser: string
  createdAt: string
  updatedUser: null
  updatedAt: null
  id: string
  firstName: string
  lastName: string
  emailAddress: string
  phoneNumber: PhoneNumber
  city: string
  status: string
  roles: UserRole[]
}

export interface CreateEditUserPayload {
  firstName: string
  lastName: string
  emailAddress: string
  phoneNumber: PhoneNumber
  city: string
  roleIds: string[]
}

export interface UserApiResponse extends BaseApiResponse {
  response: User
}
