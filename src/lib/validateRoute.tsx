import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { matchRoute } from './matchRoute'
import { getUserPermissions } from './getUserPermissions'
import { selectToken } from '@/modules/auth/authSlice'
import { protectedRoutes, publicRoutes } from '@/configs/routes'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'

interface RouteContextType {
  isPublic: boolean
  isProtected: boolean
  currentRoute: string | null
  requiredPermission: string | null
  hasPermission: boolean
}

const RouteContext = createContext<RouteContextType | undefined>(undefined)

export const ValidateRoute = ({
  children,
}: {
  children: ReactNode
}): React.JSX.Element => {
  const router = useRouter()
  const pathname = usePathname()

  const token = useAppSelector(selectToken)
  const [loading, setLoading] = useState(true)

  const publicMatch = matchRoute(pathname, publicRoutes)
  const isPublic = Boolean(publicMatch)

  const protectedMatch = matchRoute(pathname, Object.keys(protectedRoutes))
  const isProtected = Boolean(protectedMatch)
  const requiredPermission = isProtected
    ? protectedRoutes[protectedMatch?.route || '']
    : null

  const userPermissions = token ? getUserPermissions(token) : []
  const hasPermission = requiredPermission
    ? userPermissions.includes(requiredPermission)
    : true

  const contextValue: RouteContextType = {
    isPublic,
    isProtected,
    currentRoute: publicMatch?.route || protectedMatch?.route || null,
    requiredPermission,
    hasPermission,
  }

  useEffect(() => {
    const validateRoute = async (): Promise<void> => {
      setLoading(true)

      if (
        token &&
        contextValue.currentRoute &&
        ['/login', '/'].includes(contextValue.currentRoute)
      ) {
        await router.replace('/dashboard')
        return
      }

      if (!token && isProtected) {
        await router.replace('/login')
        return
      }

      if (!isPublic && !isProtected && !token) {
        await router.replace('/login')
        return
      }

      if (isProtected && !hasPermission) {
        await router.replace('/not-found')
        return
      }

      if (!isPublic && !isProtected) {
        setLoading(false)
        return
      }

      setLoading(false)
    }

    validateRoute()
  }, [
    token,
    isPublic,
    isProtected,
    contextValue.currentRoute,
    requiredPermission,
    hasPermission,
    router,
  ])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <RouteContext.Provider value={contextValue}>
      {children}
    </RouteContext.Provider>
  )
}

export const useRouteValidation = (): RouteContextType => {
  const context = useContext(RouteContext)
  if (context === undefined) {
    throw new Error('useRouteValidation must be used within a RouteProvider')
  }
  return context
}
