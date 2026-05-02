'use client'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { store } from './store'

const persistor = persistStore(store)

export default function StoreProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.ReactNode {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
