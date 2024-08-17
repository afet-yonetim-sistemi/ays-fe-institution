import axios from 'axios'
import { loginSuccess, logout } from '@/modules/auth/authSlice'
import { store } from '@/store/StoreProvider'

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
      return Promise.reject('Access denied: No token provided. Request has been canceled.')
    }
    config.headers.Authorization = `Bearer ${accessToken}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

http.interceptors.response.use(
  function (response) {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = store.getState().auth.refreshToken

        if (!refreshToken) {
          store.dispatch(logout())
          return Promise.reject(error)
        }
        try {
          const response = await api.post(
            '/api/v1/authentication/token/refresh',
            {
              refreshToken,
            },
          )
          const token = response?.data?.response

          store.dispatch(loginSuccess(token))
          originalRequest.headers.Authorization = `Bearer ${token?.accessToken}`
          return http(originalRequest)
        } catch (refreshError) {
          store.dispatch(logout())
          return Promise.reject(refreshError)
        }
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },
)

export default http
