import { combineReducers } from 'redux'
import authReducer from '@/modules/auth/authSlice'

const rootReducer = combineReducers({
  auth: authReducer,
})

export default rootReducer
