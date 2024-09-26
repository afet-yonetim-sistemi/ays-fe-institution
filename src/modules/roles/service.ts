import http from '@/configs/axiosConfig'
import {
  RoleApiResponse,
  RolePermissionApiResponse,
  Search,
} from '../roles/constants/types'
import { AxiosResponse } from 'axios'
import { BaseApiResponse } from '@/common/types'

export const getPermissions = async (): Promise<RolePermissionApiResponse> => {
  return http
    .get<RolePermissionApiResponse>('/api/v1/permissions')
    .then((response) => response.data)
}

export const postRoles = (search: Search): Promise<AxiosResponse> => {
  const sortBy = search.sort
    ? [
        {
          property: search.sort.split('.')[0],
          direction: search.sort.split('.')[1].toUpperCase(),
        },
      ]
    : []
  const filterStatus = search.status
    ? search.status?.toUpperCase().split(`.`)
    : []

  return http.post('/api/v1/roles', {
    pageable: {
      page: search.page,
      pageSize: search.per_page,
      orders: sortBy,
    },
    filter: {
      name: search.name,
      statuses: filterStatus,
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

export const deleteRole = (id: string): Promise<BaseApiResponse> => {
  return http.delete(`/api/v1/role/${id}`).then((response) => response.data)
}
