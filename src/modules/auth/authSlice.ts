import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/store/store'
import { parseJwt } from '@/lib/helpers'
import {
  setAuthTokens,
  clearAuthTokens,
  getAuthTokens,
} from '@/lib/tokenStorage'
import { UserInfo } from './constants/types'

interface AuthState {
  accessToken: string
  refreshToken: string
  permissions: string[]
  error: string | null
  isInitialized: boolean
  isRefreshTokenExpired: boolean
  userInfo: UserInfo | null
}

const tokens = getAuthTokens()
const initialPermissions = tokens.accessToken
  ? (parseJwt(tokens.accessToken)?.userPermissions ?? [])
  : []
const userInfo = tokens.accessToken ? parseJwt(tokens.accessToken) : null

const initialState: AuthState = {
  accessToken: tokens.accessToken ?? '',
  refreshToken: tokens.refreshToken ?? '',
  permissions: initialPermissions,
  error: null,
  isRefreshTokenExpired: false,
  isInitialized: true,
  userInfo
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      const userInfo = parseJwt(action.payload.accessToken)
      state.userInfo = userInfo
      state.permissions = (userInfo?.userPermissions as string[]) ?? []
      state.error = null
      state.isInitialized = true
      state.isRefreshTokenExpired = false

      setAuthTokens(action.payload.accessToken, action.payload.refreshToken)
    },
    loginFailed: (state, action) => {
      state.error = action.payload
    },
    clearRefreshTokenExpired: (state) => {
      state.isRefreshTokenExpired = false
    },
    logout: (state) => {
      state.accessToken = ''
      state.refreshToken = ''
      state.permissions = []
      state.error = null
      state.isInitialized = true
      state.isRefreshTokenExpired = false

      clearAuthTokens()
    },
    refreshTokenExpired: (state) => {
      state.accessToken = ''
      state.refreshToken = ''
      state.permissions = []
      state.error = null
      state.isInitialized = true

      clearAuthTokens()
    },
  },
})

export const {
  loginSuccess,
  loginFailed,
  refreshTokenExpired,
  clearRefreshTokenExpired,
  logout,
} = authSlice.actions

export const selectUser = (state: RootState): UserInfo | null => state.auth.userInfo
export const selectToken = (state: RootState): string => state.auth.accessToken
export const selectRefreshToken = (state: RootState): string =>
  state.auth.refreshToken
export const selectPermissions = (state: RootState): string[] =>
  state.auth.permissions
export const selectError = (state: RootState): string | null => state.auth.error
export const selectIsInitialized = (state: RootState): boolean =>
  state.auth.isInitialized
export const selectIsRefreshTokenExpired = (state: RootState): boolean => {
  if (!state.auth.refreshToken || !state.auth.isInitialized) {
    return false
  }

  try {
    const decoded = parseJwt(state.auth.refreshToken)
    if (!decoded?.exp) {
      return true
    }

    const expirationTime = decoded.exp * 1000
    const now = Date.now()

    return expirationTime <= now
  } catch (error) {
    return true
  }
}

export default authSlice.reducer
