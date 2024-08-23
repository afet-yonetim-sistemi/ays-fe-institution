import { Institution, User } from '@/common/types'

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
