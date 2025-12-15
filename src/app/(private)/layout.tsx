'use client'
import Navbar from '@/components/dashboard/navbar'
import Sidebar from '@/components/dashboard/sidebar'
import { BreakpointDirections, BreakpointSize } from '@/constants/breakpoint'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useSidebarCollapse } from '@/hooks/useSidebarCollapse'
import React, { useEffect, useRef } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { collapsed, setCollapsed, ready, setReady } = useSidebarCollapse()
  const isLgDown = useBreakpoint(BreakpointSize.lg, BreakpointDirections.down)
  const firstSet = useRef(false)

  useEffect(() => {
    if (!ready && !firstSet.current) {
      if (collapsed === null) {
        setCollapsed(isLgDown)
      }
      setReady(true)
      firstSet.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed, isLgDown, ready])

  const sidebarWidthClass = collapsed
    ? 'md:grid-cols-[70px_1fr] lg:grid-cols-[72px_1fr]'
    : 'md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'

  if (!ready) return <div />
  return (
    <div className="h-screen overflow-hidden">
      <Navbar />
      <div
        className={`grid w-full ${sidebarWidthClass} h-[calc(100dvh-3.5rem)]`}
      >
        <Sidebar />
        <main className="flex flex-1 flex-col gap-4 overflow-y-scroll p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
