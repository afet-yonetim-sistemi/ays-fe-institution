'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from './store'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

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

  return (
    <Provider store={storeRef.current}>
      {/*eslint-disable-next-line*/}
      {/* @ts-ignore*/}
      <PersistGate loading={null} persistor={storeRef.current.__persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
