import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/store/store'
import { parseJwt } from '@/lib/helpers'

interface AuthState {
  accessToken: string
  refreshToken: string
  permissions: string[]
  error: string | null
}

const initialState: AuthState = {
  accessToken: '',
  refreshToken: '',
  permissions: [],
  error: null,
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
    },
    loginFailed: (state, action) => {
      state.error = action.payload
    },
    logout: (state) => {
      state.accessToken = ''
      state.refreshToken = ''
      state.permissions = []
      state.error = null
    },
  },
})

export const { loginSuccess, loginFailed, logout } = authSlice.actions

export const selectToken = (state: RootState): string | null =>
  state.auth.accessToken
export const selectRefreshToken = (state: RootState): string | null =>
  state.auth.refreshToken
export const selectPermissions = (state: RootState): string[] =>
  state.auth.permissions
export const selectError = (state: RootState): string | null => state.auth.error

export default authSlice.reducer
