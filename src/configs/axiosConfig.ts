import axios from 'axios'
import { loginSuccess, refreshTokenExpired } from '@/modules/auth/authSlice'
import { store } from '@/store/StoreProvider'
import { updateAccessToken } from '@/lib/tokenStorage'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

http.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.accessToken

    if (!accessToken) {
      throw new Error(
        'Access denied: No token provided. Request has been canceled.'
      )
    }
    config.headers.Authorization = `Bearer ${accessToken}`
    return config
  },
  (error) => {
    throw error instanceof Error ? error : new Error('Request error')
  }
)

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = store.getState().auth.refreshToken

        if (!refreshToken) {
          store.dispatch(refreshTokenExpired())
          throw new Error('No refresh token available')
        }

        try {
          const response = await api.post(
            '/api/v1/authentication/token/refresh',
            { refreshToken }
          )
          const token = response?.data?.response

          store.dispatch(loginSuccess(token))
          updateAccessToken(token?.accessToken)
          originalRequest.headers.Authorization = `Bearer ${token?.accessToken}`
          return http(originalRequest)
        } catch (refreshError: unknown) {
          store.dispatch(refreshTokenExpired())
          throw refreshError instanceof Error
            ? refreshError
            : new Error('Token refresh failed')
        }
      } catch (error: unknown) {
        throw error instanceof Error
          ? error
          : new Error('An unexpected error occurred during token refresh')
      }
    }

    throw error instanceof Error
      ? error
      : new Error('An unexpected error occurred')
  }
)

export default http
