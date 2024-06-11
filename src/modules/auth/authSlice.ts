import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/store/store'

interface AuthState {
  accessToken: string
  refreshToken: string
  error: string | null
}

const initialState: AuthState = {
  accessToken: '',
  refreshToken: '',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.error = null
    },
    loginFailed: (state, action) => {
      state.error = action.payload
    },
    logout: (state) => {
      state.accessToken = ''
      state.refreshToken = ''
      state.error = null
    },
  },
})

export const { loginSuccess, loginFailed, logout } = authSlice.actions

export const selectToken = (state: RootState) => state.auth.accessToken
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken
export const selectError = (state: RootState) => state.auth.error

export default authSlice.reducer
