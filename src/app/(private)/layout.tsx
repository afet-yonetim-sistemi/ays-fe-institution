'use client'
import Navbar from '@/components/dashboard/navbar'
import Sidebar from '@/components/dashboard/sidebar'
import React, { useEffect } from 'react'
import { useSidebarCollapse } from '@/hooks/useSidebarCollapse'
import { SIDEBAR_COLLAPSED } from '@/constants/localStorageKey'
import { useBreakpoint } from '@/hooks/useBreakpoint'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { collapsed, setCollapsed, ready, setReady } = useSidebarCollapse()
  const isLgDown = useBreakpoint('lg', 'down')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED)
    if (saved !== null) {
      setCollapsed(saved === 'true')
    } else {
      setCollapsed(isLgDown)
    }
    setReady(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLgDown])

  useEffect(() => {
    if (ready) localStorage.setItem(SIDEBAR_COLLAPSED, String(collapsed))
  }, [collapsed, ready])

  const sidebarWidthClass = collapsed
    ? 'md:grid-cols-[70px_1fr] lg:grid-cols-[72px_1fr]'
    : 'md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'

  if (!ready) return <div />
  return (
    <div className="overflow-hidden h-screen">
      <Navbar />
      <div
        className={`grid w-full ${sidebarWidthClass} h-[calc(100dvh-3.5rem)]`}
      >
        <Sidebar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-scroll">
          {children}
        </main>
      </div>
    </div>
  )
}
