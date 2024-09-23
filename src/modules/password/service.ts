import { BaseApiResponse } from '@/common/types'
import http from '@/configs/axiosConfig'

const passwordService = {
  forgotPassword: (email: string): Promise<BaseApiResponse> =>
    http.post('/api/v1/authentication/password/forgot', {
      emailAddress: email,
    }),
  resetPassword: (
    data: {
      password: string
      passwordRepeat: string
    },
    id: string
  ): Promise<BaseApiResponse> =>
    http.post(`/api/v1/authentication/password/${id}`, data),
  validatePasswordId: (id: string): Promise<BaseApiResponse> =>
    http.get(`/api/v1/authentication/password/${id}/validity`),
}

export default passwordService
