import { BaseApiResponse } from '@/common/types'
import http from '@/configs/axiosConfig'
import { AxiosResponse } from 'axios'
import {
  RoleApiResponse,
  RolePermissionApiResponse,
  RolesFilter,
  RoleSummaryApiResponse,
} from '../roles/constants/types'
import { mapRolesFilterToApiRequest } from './utils/roleFilterMapper'

export const getPermissions = async (): Promise<RolePermissionApiResponse> => {
  return http
    .get<RolePermissionApiResponse>('/api/institution/v1/permissions')
    .then((response) => response.data)
}

export const getRoles = (filter: RolesFilter): Promise<AxiosResponse> => {
  return http.post(
    '/api/institution/v1/roles',
    mapRolesFilterToApiRequest(filter)
  )
}

export const updateRole = async (
  id: string,
  data: { name: string; permissionIds: string[] }
): Promise<BaseApiResponse> => {
  return http
    .put(`/api/institution/v1/role/${id}`, data)
    .then((response) => response.data)
}

export const getRoleDetail = async (id: string): Promise<RoleApiResponse> => {
  return http
    .get<RoleApiResponse>(`/api/institution/v1/role/${id}`)
    .then((response) => response.data)
}

export const deleteRole = async (id: string): Promise<BaseApiResponse> => {
  return http
    .delete(`/api/institution/v1/role/${id}`)
    .then((response) => response.data)
}

export const activateRole = async (id: string): Promise<BaseApiResponse> => {
  return http
    .patch(`/api/institution/v1/role/${id}/activate`)
    .then((response) => response.data)
}

export const deactivateRole = async (id: string): Promise<BaseApiResponse> => {
  return http
    .patch(`/api/institution/v1/role/${id}/passivate`)
    .then((response) => response.data)
}

export const createRole = async (data: {
  name: string
  permissionIds: string[]
}): Promise<BaseApiResponse> => {
  return http
    .post(`/api/institution/v1/role`, data)
    .then((response) => response.data)
}

export const getRoleSummary = async (): Promise<RoleSummaryApiResponse> => {
  return http
    .get<RoleSummaryApiResponse>('/api/institution/v1/roles/summary')
    .then((response) => response.data)
}
