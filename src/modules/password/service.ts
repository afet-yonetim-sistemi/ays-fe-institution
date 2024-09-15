import { api } from '@/configs/axiosConfig'

interface PasswordResponse {
  time: string
  header: string
  isSuccess: boolean
}

const passwordService = {
  forgotPassword: (email: string): Promise<PasswordResponse> =>
    api.post('/api/v1/authentication/password/forgot', {
      emailAddress: email,
    }),
  resetPassword: (
    data: {
      password: string
      passwordRepeat: string
    },
    id: string
  ): Promise<PasswordResponse> =>
    api.post(`/api/v1/authentication/password/${id}`, data),
  validatePasswordId: (id: string): Promise<PasswordResponse> =>
    api.get(`/api/v1/authentication/password/${id}/validity`),
}

export default passwordService
