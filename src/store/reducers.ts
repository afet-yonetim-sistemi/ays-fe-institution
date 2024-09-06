import { combineReducers } from 'redux'
import authReducer from '@/modules/auth/authSlice'

const rootReducer = combineReducers({
  auth: authReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
