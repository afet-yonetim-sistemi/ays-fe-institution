'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuItems } from '@/constants/menuItems'
import http from '@/configs/axiosConfig'
import packageInfo from '../../../package.json'

export default function Menu() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const UIVersion = packageInfo.version
  const [versionInfo, setVersionInfo] = useState(`UI v${UIVersion}`)

  useEffect(() => {
    const fetchData = () => {
      http
        .get('/public/actuator/info')
        .then((response) => {
          const APIVersion = response.data.application.version
          setVersionInfo((prevVersionInfo) => {
            if (!prevVersionInfo.includes("API")) {
              return `${prevVersionInfo} | API v${APIVersion}`
            }
            return prevVersionInfo
          })
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    }

    fetchData()
  }, [])

  return (
    <div className="flex flex-col h-full justify-between">
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
                  'bg-slate-200 text-black dark:bg-slate-600/50 dark:text-slate-50 font-semibold':
                    pathname === item.key,
                },
              )}
            >
              <LinkIcon className="h-6 w-6" />
              {t(item.label)}
            </Link>
          )
        })}
      </nav>
        <div className="flex justify-center py-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {versionInfo}
          </span>
        </div>
    </div>
  )
}
