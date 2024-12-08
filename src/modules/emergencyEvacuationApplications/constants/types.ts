import { BaseApiResponse, PhoneNumber, Sort } from '@/common/types'

export interface EmergencyEvacuationApplicationsFilter {
  page: number
  pageSize: number
  sort?: Sort[]
  statuses: string[]
  referenceNumber?: string
  sourceCity?: string
  sourceDistrict?: string
  seatingCount?: number
  targetCity?: string
  targetDistrict?: string
  isInPerson?: boolean
}

export interface EmergencyEvacuationApplication {
  id: string
  referenceNumber: string
  firstName: string
  lastName: string
  phoneNumber: PhoneNumber
  sourceCity: string
  sourceDistrict: string
  address: string
  seatingCount: number
  targetCity: string
  targetDistrict: string
  status: string
  applicantFirstName: string
  applicantLastName: string
  applicantPhoneNumber: PhoneNumber
  isInPerson: boolean
  hasObstaclePersonExist: boolean
  notes: string
  createdUser: string
  createdAt: string
  updatedUser: string
  updatedAt: string
}

export interface EmergencyApplicationApiResponse extends BaseApiResponse {
  response: EmergencyEvacuationApplication
}
