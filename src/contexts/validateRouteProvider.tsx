import { LoadingSpinner } from '@/components/custom/loadingSpinner'
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
}): React.ReactNode => {
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
    if (isRefreshTokenExpired && isProtected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowSessionExpiredModal((prev) => (prev ? prev : true))
    }
  }, [isRefreshTokenExpired, isProtected])

  const handleLogout = (): void => {
    dispatch(logout())
    setShowSessionExpiredModal(false)
    router.replace('/login')
  }

  useEffect(() => {
    let shouldLoad = true

    if (token) {
      if (['/login', '/'].includes(pathname)) {
        router.replace('/dashboard')
        shouldLoad = false
      } else if (!userHasPermission) {
        router.replace('/not-found')
        shouldLoad = false
      }
    } else if (isProtected) {
      router.replace('/login')
      shouldLoad = false
    }

    if (shouldLoad) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading((prev) => (prev ? false : prev))
    }
  }, [token, pathname, isProtected, userHasPermission, router])

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
