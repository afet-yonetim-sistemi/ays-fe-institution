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
  lineNumber?: string
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

export interface CreateUserPayload {
  firstName: string
  lastName: string
  emailAddress: string
  phoneNumber: PhoneNumber
  city: string
  roleIds: string[]
}

export type UserEditableFields = Pick<
  User,
  'firstName' | 'lastName' | 'emailAddress' | 'phoneNumber' | 'city'
> &
  Pick<CreateUserPayload, 'roleIds'>

export interface UserApiResponse extends BaseApiResponse {
  response: User
}
