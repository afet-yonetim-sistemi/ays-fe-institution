'use client'
import clsx from 'clsx'
import { HomeIcon, Users2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const items = [
  {
    key: '/dashboard',
    label: 'Home',
    icon: HomeIcon,
  },
  {
    key: 'dashboard/users',
    label: 'Users',
    icon: Users2,
  },
]

export default function Menu() {
  const pathname = usePathname()
  console.log(pathname)
  return (
    <nav className="grid items-start gap-1 text-sm font-medium md:p-2 w-full">
      {items.map((item) => {
        const LinkIcon = item.icon
        return (
          <Link
            key={item.key}
            href={item.key}
            className={clsx(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
              {
                'bg-slate-200 font-semibold': pathname === item.key,
              },
            )}
          >
            <LinkIcon className="h-6 w-6" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
