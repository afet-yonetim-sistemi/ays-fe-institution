import React, { ReactNode, useState, useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { matchRoute } from '@/lib/matchRoute'
import { getUserPermissions } from '@/lib/getUserPermissions'
import { selectToken } from '@/modules/auth/authSlice'
import { protectedRoutes } from '@/configs/routes'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import {
  ValidateRouteContext,
  ValidateRouteContextType,
} from '@/contexts/validateRouteContext'

export const ValidateRouteProvider = ({
  children,
}: {
  children: ReactNode
}): React.JSX.Element => {
  const router = useRouter()
  const pathname = usePathname()
  const token = useAppSelector(selectToken)

  const [loading, setLoading] = useState(true)

  const protectedMatch = matchRoute(pathname, Object.keys(protectedRoutes))
  const isProtected = Boolean(protectedMatch)
  const requiredPermission = isProtected
    ? protectedRoutes[protectedMatch?.route ?? '']
    : null

  const userPermissions = token ? getUserPermissions(token) : []
  const hasPermission = requiredPermission
    ? userPermissions.includes(requiredPermission)
    : true

  const contextValue: ValidateRouteContextType = useMemo(
    () => ({
      currentRoute: pathname,
      isProtected,
      requiredPermission,
      hasPermission,
    }),
    [pathname, isProtected, requiredPermission, hasPermission]
  )

  useEffect(() => {
    if (token) {
      if (['/login', '/'].includes(pathname)) {
        router.replace('/dashboard')
      } else if (isProtected && !hasPermission) {
        router.replace('/not-found')
      } else {
        setLoading(false)
      }
    } else {
      if (isProtected) {
        router.replace('/login')
      } else {
        setLoading(false)
      }
    }
  }, [token, pathname, isProtected, hasPermission, router, loading])

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
    </ValidateRouteContext.Provider>
  )
}
