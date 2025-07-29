'use client'

import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import {
  ValidateRouteContext,
  ValidateRouteContextType,
} from '@/contexts/validateRouteContext'
import { getRouteStatus } from '@/lib/getRouteStatus'
import { getUserPermissions } from '@/lib/getUserPermissions'
import { selectToken } from '@/modules/auth/authSlice'
import { useAppSelector } from '@/store/hooks'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useMemo, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useTranslation } from 'react-i18next'

export const ValidateRouteProvider = ({
  children,
}: {
  children: ReactNode
}): React.JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const token = useAppSelector(selectToken)

  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [countdown, setCountdown] = useState(3)

  const { isProtected, route, requiredPermission } = getRouteStatus(pathname)
  const userPermissions = token ? getUserPermissions(token) : []

  const userHasPermission = requiredPermission
    ? userPermissions.includes(requiredPermission)
    : true

  const contextValue: ValidateRouteContextType = useMemo(
    () => ({
      currentRoute: route,
      isProtected,
      requiredPermission,
      userHasPermission,
    }),
    [route, isProtected, requiredPermission, userHasPermission]
  )

  useEffect(() => {
    if (token) {
      if (['/login', '/'].includes(pathname)) {
        router.replace('/dashboard')
      } else if (!userHasPermission) {
        router.replace('/not-found')
      } else {
        setLoading(false)
      }
    } else if (isProtected) {
      setShowModal(true)
    } else {
      setLoading(false)
    }
  }, [token, pathname, isProtected, userHasPermission, router])

  useEffect(() => {
    if (!showModal) return

    if (showModal) {
      setCountdown(3)
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval)
          setShowModal(false)
          router.replace('/login')
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [showModal, router])

  if (loading || showModal) {
    return (
      <>
        <Dialog open={showModal}>
          <DialogContent
            className="sm:max-w-md"
            showClose={false}
            onEscapeKeyDown={(e) => e.preventDefault()}
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>{t('sessionExpired.title')}</DialogTitle>
              <DialogDescription>
                {t('sessionExpired.description')}
                <br />
                {t('sessionExpired.countdown', { count: countdown })}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
      </>
    )
  }

  return (
    <ValidateRouteContext.Provider value={contextValue}>
      {children}
    </ValidateRouteContext.Provider>
  )
}
