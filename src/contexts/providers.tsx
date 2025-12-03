'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import { ModalProvider } from '@/contexts/modalContext'
import { ValidateRouteProvider } from '@/contexts/validateRouteProvider'
import i18n from '@/i18n'
import StoreProvider from '@/store/StoreProvider'
import { I18nextProvider } from 'react-i18next'

export const Providers = (props: React.PropsWithChildren): JSX.Element => {
  return (
    <I18nextProvider i18n={i18n} defaultNS={'translation'}>
      <StoreProvider>
        <ValidateRouteProvider>
          <TooltipProvider>
            <ModalProvider>{props.children}</ModalProvider>
          </TooltipProvider>
        </ValidateRouteProvider>
      </StoreProvider>
    </I18nextProvider>
  )
}
