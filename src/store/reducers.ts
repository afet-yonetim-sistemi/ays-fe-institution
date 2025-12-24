import authReducer from '@/modules/auth/authSlice'
import { combineReducers } from '@reduxjs/toolkit'
import sidebar from './sidebarSlice'

const rootReducer = combineReducers({
  sidebar,
  auth: authReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
