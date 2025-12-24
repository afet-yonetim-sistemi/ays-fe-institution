/* eslint-disable react-hooks/refs */
'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { AppStore, makeStore } from './store'

export const store = makeStore()

export default function StoreProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>): JSX.Element {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    storeRef.current = store
    //eslint-disable-next-line
    //@ts-ignore
    storeRef.current.__persistor = persistStore(store)
  }
  const activeStore = storeRef.current

  return (
    <Provider store={activeStore}>
      {/*eslint-disable-next-line*/}
      {/* @ts-ignore*/}
      <PersistGate loading={null} persistor={activeStore.__persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
