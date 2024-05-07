'use client'

import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import StoreProvider from '@/store/StoreProvider'
import { AntdRegistry } from '@ant-design/nextjs-registry'

export const Providers = (props: React.PropsWithChildren) => {
  return (
    <I18nextProvider i18n={i18n} defaultNS={'translation'}>
      <AntdRegistry>
        <StoreProvider>{props.children}</StoreProvider>
      </AntdRegistry>
    </I18nextProvider>
  )
}
