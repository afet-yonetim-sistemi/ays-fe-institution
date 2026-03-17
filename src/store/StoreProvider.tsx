'use client'
import { useState } from 'react'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { makeStore } from './store'

export const store = makeStore()

export default function StoreProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.ReactNode {
  const [storeInstance] = useState(() => {
    const s = makeStore()
    //eslint-disable-next-line
    //@ts-ignore
    s.__persistor = persistStore(s)
    return s
  })

  return (
    <Provider store={storeInstance}>
      {/*eslint-disable-next-line*/}
      {/* @ts-ignore*/}
      <PersistGate loading={null} persistor={storeInstance.__persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
