'use client'

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({
  children,
  ...props
}: Readonly<ThemeProviderProps>): React.ReactNode {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
