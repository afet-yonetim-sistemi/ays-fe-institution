import { configureStore, Store } from '@reduxjs/toolkit'
import { persistReducer, Storage } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

import rootReducer from './reducers'

interface NoopStorage extends Storage {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>
}

const createNoopStorage = (): NoopStorage => {
  return {
    getItem(): Promise<string | null> {
      return Promise.resolve(null)
    },
    setItem(): Promise<void> {
      return Promise.resolve()
    },
    removeItem(): Promise<void> {
      return Promise.resolve()
    },
  }
}

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage()

//eslint-disable-next-line
const persistConfig: { key: string; storage: any } = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const makeStore = (): Store => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
    devTools: true,
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
