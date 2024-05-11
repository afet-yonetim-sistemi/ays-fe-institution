import Navbar from '@/components/dashboard/navbar'
import Sidenav from '@/components/dashboard/sidenav'

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="overflow-hidden h-screen">
      <Navbar />
      <div className="grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] h-[calc(100dvh-3.5rem)]">
        <Sidenav />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
