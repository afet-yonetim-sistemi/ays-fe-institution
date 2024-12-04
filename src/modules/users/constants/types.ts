import { Sort } from '@/common/types'

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
