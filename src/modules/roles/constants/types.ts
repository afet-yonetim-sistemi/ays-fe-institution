export interface Roles {
  // eslint-disable-next-line
  content: any[]
  totalPageCount: number
}
export interface RolesTableProps {
  name: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface Search {
  page: number
  per_page: number
  sort: string | undefined
  name: string | undefined
  status: string | undefined
  createdAt: string | undefined
  updatedAt: string | undefined
}

export interface StatusProps {
  status: string
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

export interface RoleApiResponse {
  time: string
  isSuccess: boolean
  response: RoleDetail
}

export interface RolePermissionApiResponse {
  time: string
  isSuccess: boolean
  response: RolePermission[]
}
