import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import i18n from '@/i18n'
import { Providers } from '@/lib/providers'
import { ThemeProvider } from '@/components/themeProvider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: i18n.t('aysTitle'),
  description: i18n.t('aysDescription'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={i18n.language}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
          <Toaster/>
        </ThemeProvider>
      </body>
    </html>
  )
}
