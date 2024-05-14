import http, { api } from '@/configs/axiosConfig'

const authService = {
  login: (data: any) => api.post('/api/v2/authentication/token', data),
  logout: (data: any) =>
    http.post('/api/v2/authentication/token/invalidate', {
      refreshToken: data,
    }),
}

export default authService
