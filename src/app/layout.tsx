import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import i18n from '@/i18n'
import { Providers } from '@/contexts/providers'
import { ThemeProvider } from '@/components/themeProvider'
import { Toaster } from '@/components/ui/toaster'
import GlobalModals from '@/components/GlobalModals'

const inter = Inter({ subsets: ['latin'] })

export const generateMetadata = async (): Promise<Metadata> => ({
  title: i18n.t('metaData.aysTitle'),
  description: i18n.t('metaData.aysDescription'),
  openGraph: {
    title: i18n.t('metaData.aysTitle'),
    description: i18n.t('metaData.aysDescription'),
    type: 'website',
    locale: i18n.language,
  },
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): JSX.Element {
  return (
    <html lang={i18n.language}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children} <Toaster />
            <GlobalModals />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
