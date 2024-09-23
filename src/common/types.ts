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

export interface PhoneNumber {
  countryCode: string
  lineNumber: string
}

export interface BaseApiResponse {
  isSuccess: boolean
  time: string
  header?: string
  message?: string
}
