import { BaseApiResponse, Sort } from '@/common/types'
import { UserRole } from '@/modules/users/constants/types'

export interface RolesFilter {
  page: number
  pageSize: number
  sort?: Sort[]
  name?: string
  statuses: string[]
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
