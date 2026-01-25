import { BaseApiResponse, Sort } from '@/common/types'
import { UserRole } from '@/modules/users/constants/types'
import { SearchParamValue } from '@/utils/searchParamsParser'

export interface RolesFilter extends Record<string, SearchParamValue> {
  page: number
  pageSize: number
  sort?: Sort[]
  name?: string
  statuses: string[]
}

export interface RoleFilterParams {
  statuses?: string[]
  name?: string
}

export interface RolePermission {
  id: string
  name: string
  category: string
  isActive?: boolean
}

export interface RoleDetail {
  createdUser: string
  createdAt: string
  updatedUser: string
  updatedAt: string
  id: string
  name: string
  status: string
  permissions: RolePermission[]
}

export interface RoleApiResponse extends BaseApiResponse {
  response: RoleDetail
}

export interface RolePermissionApiResponse extends BaseApiResponse {
  response: RolePermission[]
}

export interface RoleSummaryApiResponse extends BaseApiResponse {
  response: UserRole[]
}
