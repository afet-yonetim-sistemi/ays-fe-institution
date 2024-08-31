import { PhoneNumber } from '@/common/types'

export interface EmergencyEvacuationApplications {
  content: any[]
  totalPageCount: number
}
export interface EmergencyEvacuationApplicationsTableProps {
  id: string
  referenceNumber: any
  firstName: string
  lastName: string
  isInPerson: boolean
  status: string[]
  createdAt: string
  seatingCount: number
  phoneNumber: {
    lineNumber: string
  }
}
export interface Search {
  page: number
  per_page: number
  sort: string | undefined
  status: string | undefined
  referenceNumber: any
  seatingCount: number | null
  sourceCity: string | undefined
  sourceDistrict: string | undefined
  targetCity: string | undefined
  targetDistrict: string | undefined
  isInPerson: true | null
}

export interface StatusProps {
  status: string
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

export interface ApiResponse {
  time: string
  isSuccess: boolean
  response: EmergencyEvacuationApplication
}
