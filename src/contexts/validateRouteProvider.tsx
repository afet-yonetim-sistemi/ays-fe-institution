import { LoadingSpinner } from '@/components/ui'

import {
  ValidateRouteContext,
  ValidateRouteContextType,
} from '@/contexts/validateRouteContext'
import { getRouteStatus } from '@/lib/getRouteStatus'
import { getUserPermissions } from '@/lib/getUserPermissions'
import {
  logout,
  selectIsRefreshTokenExpired,
  selectToken,
} from '@/modules/auth/authSlice'
import SessionExpiredModal from '@/modules/auth/components/SessionExpiredModal'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { usePathname, useRouter } from 'next/navigation'
import React, { ReactNode, useEffect, useMemo, useState } from 'react'

export const ValidateRouteProvider = ({
  children,
}: {
  children: ReactNode
}): React.JSX.Element => {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const token = useAppSelector(selectToken)
  const isRefreshTokenExpired = useAppSelector(selectIsRefreshTokenExpired)
  const [loading, setLoading] = useState(true)
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false)
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
    if (isRefreshTokenExpired && !showSessionExpiredModal && isProtected) {
      setTimeout(() => setShowSessionExpiredModal(true), 0)
    }
  }, [isRefreshTokenExpired, showSessionExpiredModal, isProtected])

  const handleLogout = (): void => {
    dispatch(logout())
    setShowSessionExpiredModal(false)
    router.replace('/login')
  }

  useEffect(() => {
    if (token) {
      if (['/login', '/'].includes(pathname)) {
        router.replace('/dashboard')
      } else if (!userHasPermission) {
        router.replace('/not-found')
      } else {
        setTimeout(() => setLoading(false), 0)
      }
    } else if (isProtected) {
      router.replace('/login')
    } else {
      setTimeout(() => setLoading(false), 0)
    }
  }, [token, pathname, isProtected, userHasPermission, router, loading])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <ValidateRouteContext.Provider value={contextValue}>
      {children}
      {showSessionExpiredModal && (
        <SessionExpiredModal onLogout={handleLogout} />
      )}
    </ValidateRouteContext.Provider>
  )
}
