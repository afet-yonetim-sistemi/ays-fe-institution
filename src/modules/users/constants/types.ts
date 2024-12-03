import { PhoneNumber, Sort } from '@/common/types'

export interface UsersFilter {
  page: number
  pageSize: number
  sort?: Sort[]
  statuses: string[]
  firstName?: string
  lastName?: string
  emailAddress?: string
  phoneNumber?: PhoneNumber
  city?: string
}
