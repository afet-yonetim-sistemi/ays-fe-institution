'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuItems } from "@/constants/menuItems";
import axios from 'axios';
import http from '@/configs/axiosConfig'
  
export default function Menu() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const [versionInfo, setVersionInfo] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await http.get('/public/actuator/info')
        const version = response.data.application.version
        setVersionInfo(version)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    
    fetchData()
  }, [])

  return (
    <nav className="grid items-start gap-1 text-sm font-medium md:p-2 w-full">
      {MenuItems.map((item) => {
        const LinkIcon = item.icon
        return (
          <Link
            key={item.key}
            href={item.key}
            className={clsx(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-primary',
              {
                'bg-slate-200 text-black dark:bg-slate-600/50 dark:text-slate-50 font-semibold': pathname === item.key,
              },
            )}
          >
            <LinkIcon className="h-6 w-6" />
            {t(item.label)}
          </Link>
        )
      })}
      {versionInfo && (
        <div className="text-center absolute bottom-2 text-xs text-gray-500 dark:text-gray-400">
          {t("version")} {versionInfo}
        </div>
      )}
    </nav>
  )
}
