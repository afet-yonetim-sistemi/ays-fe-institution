import http from '@/configs/axiosConfig'
import {
  RoleApiResponse,
  RolePermissionApiResponse,
  RolesFilter,
  RoleSummaryApiResponse,
} from '../roles/constants/types'
import { AxiosResponse } from 'axios'
import { BaseApiResponse } from '@/common/types'

export const getPermissions = async (): Promise<RolePermissionApiResponse> => {
  return http
    .get<RolePermissionApiResponse>('/api/v1/permissions')
    .then((response) => response.data)
}

export const getRoles = (filter: RolesFilter): Promise<AxiosResponse> => {
  const orders =
    filter.sort && filter.sort.length > 0
      ? filter.sort.map((sort) => ({
          property: sort?.column,
          direction: sort?.direction?.toUpperCase(),
        }))
      : undefined

  return http.post('/api/v1/roles', {
    pageable: {
      page: filter.page || 1,
      pageSize: filter.pageSize || 10,
      ...(orders ? { orders } : []),
    },
    filter: {
      name: filter.name || undefined,
      ...(filter.statuses.length > 0
        ? { statuses: filter.statuses }
        : undefined),
    },
  })
}

export const updateRole = async (
  id: string,
  data: { name: string; permissionIds: string[] }
): Promise<BaseApiResponse> => {
  return http.put(`/api/v1/role/${id}`, data).then((response) => response.data)
}

export const getRoleDetail = async (id: string): Promise<RoleApiResponse> => {
  return http
    .get<RoleApiResponse>(`/api/v1/role/${id}`)
    .then((response) => response.data)
}

export const deleteRole = async (id: string): Promise<BaseApiResponse> => {
  return http.delete(`/api/v1/role/${id}`).then((response) => response.data)
}

export const activateRole = async (id: string): Promise<BaseApiResponse> => {
  return http
    .patch(`/api/v1/role/${id}/activate`)
    .then((response) => response.data)
}

export const deactivateRole = async (id: string): Promise<BaseApiResponse> => {
  return http
    .patch(`/api/v1/role/${id}/passivate`)
    .then((response) => response.data)
}

export const createRole = async (data: {
  name: string
  permissionIds: string[]
}): Promise<BaseApiResponse> => {
  return http.post(`/api/v1/role`, data).then((response) => response.data)
}

export const getRoleSummary = async (): Promise<RoleSummaryApiResponse> => {
  return http
    .get<RoleSummaryApiResponse>('/api/v1/roles/summary')
    .then((response) => response.data)
}
