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
import { handleErrorToast } from '@/lib/handleErrorToast'

const Menu = (): JSX.Element => {
  const pathname = usePathname()
  const { t } = useTranslation()
  const userPermissions = useAppSelector(selectPermissions) ?? []

  const uiVersion = packageInfo.version
  const [apiVersionInfo, setApiVersionInfo] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const hasPermission = (requiredPermissions?: Permission[]): boolean => {
    if (!requiredPermissions) return true
    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    )
  }

  const filteredMenuItems = MenuItems.filter((menuItem) =>
    hasPermission(menuItem.requiredPermissions)
  )

  useEffect(() => {
    const localStorageVersion = localStorage.getItem('apiVersionInfo')

    if (localStorageVersion) {
      setApiVersionInfo(localStorageVersion)
      setIsLoading(false)
    }

    const fetchData = (): void => {
      http
        .get('/public/actuator/info')
        .then((response) => {
          const fetchedApiVersion = response.data.application.version
          if (fetchedApiVersion !== localStorageVersion) {
            localStorage.setItem('apiVersionInfo', fetchedApiVersion)
            setApiVersionInfo(fetchedApiVersion)
          }
          setIsLoading(false)
        })
        .catch((error) => {
          setIsLoading(false)
          handleErrorToast(error)
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
          UI v{uiVersion} |{' '}
          {isLoading ? (
            <LoadingSpinner size={10} />
          ) : (
            apiVersionInfo && `API v${apiVersionInfo}`
          )}
        </span>
      </div>
    </div>
  )
}

export default Menu
