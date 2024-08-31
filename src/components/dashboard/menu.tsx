'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuItems } from '@/constants/menuItems'
import http from '@/configs/axiosConfig'
import packageInfo from '../../../package.json'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { selectPermissions } from '@/modules/auth/authSlice'
import { useAppSelector } from '@/store/hooks'
import { Permission } from '@/constants/permissions'

export default function Menu() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const userPermissions = useAppSelector(selectPermissions) ?? []

  const UIVersion = packageInfo.version
  const [APIversionInfo, setAPIVersionInfo] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const hasPermission = (requiredPermissions?: Permission[]) => {
    if (!requiredPermissions) return true
    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    )
  }

  const filteredMenuItems = MenuItems.filter((menuItem) =>
    hasPermission(menuItem.requiredPermissions)
  )

  useEffect(() => {
    const localStorageVersion = localStorage.getItem('APIversionInfo')

    if (localStorageVersion) {
      setAPIVersionInfo(localStorageVersion)
      setIsLoading(false)
    }

    const fetchData = () => {
      http
        .get('/public/actuator/info')
        .then((response) => {
          const fetchedAPIVersion = response.data.application.version
          if (fetchedAPIVersion !== localStorageVersion) {
            localStorage.setItem('APIversionInfo', fetchedAPIVersion)
            setAPIVersionInfo(fetchedAPIVersion)
          }
          setIsLoading(false)
        })
        .catch((error) => {
          setIsLoading(false)
        })
    }

    fetchData()
  }, [])

  return (
    <div className="flex flex-col h-full justify-between">
      <nav className="grid items-start gap-1 text-sm font-medium md:p-2 w-full">
        {filteredMenuItems.map((item) => {
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
                }
              )}
            >
              <LinkIcon className="h-6 w-6" />
              {t(item.label)}
            </Link>
          )
        })}
      </nav>
      <div className="flex justify-center py-2">
        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
          UI v{UIVersion} |{' '}
          {isLoading ? (
            <LoadingSpinner size={10} />
          ) : (
            APIversionInfo && `API v${APIversionInfo}`
          )}
        </span>
      </div>
    </div>
  )
}
