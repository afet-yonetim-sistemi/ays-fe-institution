import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/store/store'
import { parseJwt } from '@/lib/helpers'

interface AuthState {
  accessToken: string
  refreshToken: string
  permissions: string[]
  error: string | null
  isRefreshTokenExpired: boolean
}

const initialState: AuthState = {
  accessToken: '',
  refreshToken: '',
  permissions: [],
  error: null,
  isRefreshTokenExpired: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      const userInfo = parseJwt(action.payload.accessToken)
      state.permissions = (userInfo?.userPermissions as string[]) || []
      state.error = null
      state.isRefreshTokenExpired = false
    },
    loginFailed: (state, action) => {
      state.error = action.payload
    },
    refreshTokenExpired: (state) => {
      state.isRefreshTokenExpired = true
    },
    clearRefreshTokenExpired: (state) => {
      state.isRefreshTokenExpired = false
    },
    logout: (state) => {
      state.accessToken = ''
      state.refreshToken = ''
      state.permissions = []
      state.error = null
      state.isRefreshTokenExpired = false
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

export const selectToken = (state: RootState): string => state.auth.accessToken
export const selectRefreshToken = (state: RootState): string =>
  state.auth.refreshToken
export const selectPermissions = (state: RootState): string[] =>
  state.auth.permissions
export const selectError = (state: RootState): string | null => state.auth.error
export const selectIsRefreshTokenExpired = (state: RootState): boolean =>
  state.auth.isRefreshTokenExpired

export default authSlice.reducer
