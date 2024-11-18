import LanguageToggle from '@/components/dashboard/languageToggle'
import { ModeToggle } from '@/components/dashboard/modeToggle'
import React from 'react'

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <div>
      <nav className="fixed flex gap-2 right-8 top-4">
        <ModeToggle />
        <LanguageToggle />
      </nav>
      {children}
    </div>
  )
}
