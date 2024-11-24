'use client'

import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import StoreProvider from '@/store/StoreProvider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ValidateRoute } from './validateRoute'

export const Providers = (props: React.PropsWithChildren): JSX.Element => {
  return (
    <I18nextProvider i18n={i18n} defaultNS={'translation'}>
      <StoreProvider>
        <ValidateRoute>
          <TooltipProvider>{props.children}</TooltipProvider>
        </ValidateRoute>
      </StoreProvider>
    </I18nextProvider>
  )
}
