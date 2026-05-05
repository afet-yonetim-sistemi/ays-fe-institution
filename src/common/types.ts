export type SortDirection = 'asc' | 'desc' | undefined

export type Sort =
  | {
      column: string
      direction: SortDirection
    }
  | undefined

export interface LabeledItem {
  label: string
  value: string
  color: string
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

export interface RegexValidation {
  regex: RegExp
  message: string
}

export interface FilterValidationOptions {
  min?: number
  max?: number
  regex?: RegExp
  customRegexes?: RegexValidation[]
}

export enum SearchParamType {
  STRING = 'string',
  NUMBER = 'number',
  ARRAY = 'array',
  SORT = 'sort',
}

export interface PageableParams {
  page: number
  pageSize: number
  orders?: Array<{ property: string; direction: string }>
}

export interface ApiRequest<T> {
  pageable: PageableParams
  filter: T
}
