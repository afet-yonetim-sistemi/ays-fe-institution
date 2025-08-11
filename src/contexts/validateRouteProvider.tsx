import React, { ReactNode, useState, useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { getRouteStatus } from '@/lib/getRouteStatus'
import { getUserPermissions } from '@/lib/getUserPermissions'
import { selectToken } from '@/modules/auth/authSlice'
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
    </ValidateRouteContext.Provider>
  )
}
