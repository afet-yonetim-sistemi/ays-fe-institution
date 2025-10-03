import { BaseApiResponse } from '@/common/types'
import { api } from '@/configs/axiosConfig'

const passwordService = {
  forgotPassword: (email: string): Promise<BaseApiResponse> =>
    api.post('/api/institution/v1/authentication/password/forgot', {
      emailAddress: email,
    }),
  resetPassword: (
    data: {
      password: string
      passwordRepeat: string
    },
    id: string
  ): Promise<BaseApiResponse> =>
    api.post(`/api/institution/v1/authentication/password/${id}`, data),
  validatePasswordId: (id: string): Promise<BaseApiResponse> =>
    api.get(`/api/institution/v1/authentication/password/${id}/validity`),
}

export default passwordService
