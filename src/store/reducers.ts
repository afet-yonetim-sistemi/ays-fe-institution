import { combineReducers } from 'redux'
import counterReducer from '@/modules/counter/counterSlice'

const rootReducer = combineReducers({
  counter: counterReducer,
})

export default rootReducer
