import { api } from '@/configs/axiosConfig'

const passwordService = {
  forgotPassword: (email: string) => api.post('/api/v1/authentication/password/forgot', {
    emailAddress: email
  }),
  resetPassword: (data: {
    password: string,
    passwordRepeat: string
  }, id: string) => api.post(`/api/v1/authentication/password/${id}`, data),
  validatePasswordId: (id: string) => api.get(`/api/v1/authentication/password/${id}/validity`)
}

export default passwordService
