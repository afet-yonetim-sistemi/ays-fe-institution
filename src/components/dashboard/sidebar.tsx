import React from 'react'
import Menu from './menu'

export default function Sidebar() {
  return (
    <div className="hidden border-r bg-muted/40 md:block overflow-auto">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <Menu />
      </div>
    </div>
  )
}
