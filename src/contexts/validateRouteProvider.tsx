import React, { ReactNode, useState, useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getRouteStatus } from '@/lib/getRouteStatus'
import { getUserPermissions } from '@/lib/getUserPermissions'
import {
  selectToken,
  selectIsRefreshTokenExpired,
  logout,
} from '@/modules/auth/authSlice'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import {
  ValidateRouteContext,
  ValidateRouteContextType,
} from '@/contexts/validateRouteContext'
import SessionExpiredModal from '@/modules/auth/components/SessionExpiredModal'

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
      setShowSessionExpiredModal(true)
    }
  }, [isRefreshTokenExpired, showSessionExpiredModal, isProtected])

  const handleLogout = () => {
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
        setLoading(false)
      }
    } else if (isProtected) {
      router.replace('/login')
    } else {
      setLoading(false)
    }
  }, [token, pathname, isProtected, userHasPermission, router, loading])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
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
