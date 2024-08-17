import http, { api } from '@/configs/axiosConfig'

const authService = {
  login: (data: any) => api.post('/api/v1/authentication/token', data),
  logout: (data: any) =>
    http.post('/api/v1/authentication/token/invalidate', {
      refreshToken: data
    }),
  forgotPassword: (email: string) => api.post('/api/v1/authentication/password/forgot', {
    emailAddress: email
  })
}

export default authService
