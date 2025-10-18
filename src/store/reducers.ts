import { combineReducers } from 'redux'
import sidebar from './sidebarSlice'
import authReducer from '@/modules/auth/authSlice'

const rootReducer = combineReducers({
  sidebar,
  auth: authReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
