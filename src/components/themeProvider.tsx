'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export function ThemeProvider({
  children,
  ...props
}: Readonly<ThemeProviderProps>): React.ReactNode {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
