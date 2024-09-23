import http from '@/configs/axiosConfig'

interface LoginResponseData {
  time: string
  isSuccess: boolean
  data: {
    response: {
      accessToken: string
      accessTokenExpiresAt: number
      refreshToken: string
    }
  }
}

interface LogoutResponseData {
  isSuccess: boolean
}

const authService = {
  login: (data: object): Promise<LoginResponseData> =>
    http.post('/api/v1/authentication/token', data),
  logout: (data: string): Promise<LogoutResponseData> =>
    http.post('/api/v1/authentication/token/invalidate', {
      refreshToken: data,
    }),
}

export default authService
