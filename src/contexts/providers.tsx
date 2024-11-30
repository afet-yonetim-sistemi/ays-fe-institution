'use client'

import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import StoreProvider from '@/store/StoreProvider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ValidateRouteProvider } from '@/contexts/validateRouteProvider'

export const Providers = (props: React.PropsWithChildren): JSX.Element => {
  return (
    <I18nextProvider i18n={i18n} defaultNS={'translation'}>
      <StoreProvider>
        <ValidateRouteProvider>
          <TooltipProvider>{props.children}</TooltipProvider>
        </ValidateRouteProvider>
      </StoreProvider>
    </I18nextProvider>
  )
}
