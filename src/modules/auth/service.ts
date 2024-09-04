import http, { api } from '@/configs/axiosConfig'

interface LoginResponseData {
  time: string
  isSuccess: boolean
  response: {
    accessToken: string
    accessTokenExpiresAt: number
    refreshToken: string
  }
}

interface LogoutResponseData {
  isSuccess: boolean
}

const authService = {
  login: (data: object): Promise<LoginResponseData> =>
    api.post('/api/v1/authentication/token', data),
  logout: (data: object): Promise<LogoutResponseData> =>
    http.post('/api/v1/authentication/token/invalidate', {
      refreshToken: data,
    }),
}

export default authService
