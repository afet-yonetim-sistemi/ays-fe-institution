import LanguageToggle from '@/components/dashboard/languageToggle'
import { ModeToggle } from '@/components/dashboard/modeToggle'

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <div className="overflow-auto scrollbar-gutter-stable h-screen">
      <nav className="fixed flex gap-2 right-8 top-4">
        <ModeToggle />
        <LanguageToggle />
      </nav>
      {children}
    </div>
  )
}
