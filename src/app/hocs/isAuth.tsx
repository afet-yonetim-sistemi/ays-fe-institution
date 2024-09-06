'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectPermissions, selectToken } from '@/modules/auth/authSlice'
import { Permission } from '@/constants/permissions'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'

interface PrivateRouteProps {
  children: React.ReactNode
  requiredPermissions?: Permission[]
}

const PrivateRoute = ({
  children,
  requiredPermissions,
}: PrivateRouteProps): JSX.Element | null => {
  const router = useRouter()
  const token = useAppSelector(selectToken)
  const userPermissions = useAppSelector(selectPermissions)
  const memoizedPermissions = useMemo(
    () => userPermissions ?? [],
    [userPermissions]
  )

  const [isAuthorized, setIsAuthorized] = useState<boolean>(false)

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }
    if (requiredPermissions) {
      const hasPermission = requiredPermissions.every((permission) =>
        memoizedPermissions.includes(permission)
      )

      if (!hasPermission) {
        router.push('/not-found')
        return
      }
    }

    setIsAuthorized(true)
  }, [token, router, memoizedPermissions, requiredPermissions])

  if (!token || (requiredPermissions && !isAuthorized)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size={96} />
      </div>
    )
  }

  return <>{children}</>
}

export default PrivateRoute
