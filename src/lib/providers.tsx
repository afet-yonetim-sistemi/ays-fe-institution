'use client'

import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import StoreProvider from '@/store/StoreProvider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

export const Providers = (props: React.PropsWithChildren): JSX.Element => {
  return (
    <I18nextProvider i18n={i18n} defaultNS={'translation'}>
      <StoreProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            {props.children}
            <ReactQueryDevtools initialIsOpen={false} />
          </TooltipProvider>
        </QueryClientProvider>
      </StoreProvider>
    </I18nextProvider>
  )
}
