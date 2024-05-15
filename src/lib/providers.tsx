'use client'

import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import StoreProvider from '@/store/StoreProvider'

export const Providers = (props: React.PropsWithChildren) => {
  return (
    <I18nextProvider i18n={i18n} defaultNS={'translation'}>
      <StoreProvider>{props.children}</StoreProvider>
    </I18nextProvider>
  )
}
