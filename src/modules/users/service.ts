import { BaseApiResponse } from '@/common/types'
import http from '@/configs/axiosConfig'
import { AxiosResponse } from 'axios'
import {
  CreateUserPayload,
  UserApiResponse,
  UserEditableFields,
  UsersFilter,
} from './constants/types'
import { mapUsersFilterToApiRequest } from './utils/userFilterMapper'

export const getUsers = (filter: UsersFilter): Promise<AxiosResponse> => {
  const request = mapUsersFilterToApiRequest(filter)
  return http.post('/api/institution/v1/users', request)
}

export const getUser = async (id: string): Promise<UserApiResponse> => {
  return http
    .get<UserApiResponse>(`/api/institution/v1/user/${id}`)
    .then((response) => response.data)
}

export const createUser = async (
  data: CreateUserPayload
): Promise<BaseApiResponse> => {
  return http
    .post('/api/institution/v1/user', data)
    .then((response) => response.data)
}

export const activateUser = async (id: string): Promise<BaseApiResponse> => {
  return http
    .patch(`/api/institution/v1/user/${id}/activate`)
    .then((response) => response.data)
}

export const deactivateUser = async (id: string): Promise<BaseApiResponse> => {
  return http
    .patch(`/api/institution/v1/user/${id}/passivate`)
    .then((response) => response.data)
}

export const deleteUser = async (id: string): Promise<BaseApiResponse> => {
  return http
    .delete(`/api/institution/v1/user/${id}`)
    .then((response) => response.data)
}

export const updateUser = async (
  id: string,
  data: UserEditableFields
): Promise<BaseApiResponse> => {
  return http
    .put(`/api/institution/v1/user/${id}`, data)
    .then((response) => response.data)
}
