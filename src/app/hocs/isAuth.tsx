'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectPermissions, selectToken } from '@/modules/auth/authSlice'
import { Permission } from '@/constants/permissions'

interface PrivateRouteProps {
  children: React.ReactNode
  requiredPermissions?: Permission[]
}

const PrivateRoute = ({ children, requiredPermissions }: PrivateRouteProps) => {
  const router = useRouter()
  const token = useAppSelector(selectToken)
  const userPermissions = useAppSelector(selectPermissions)
  const memoizedPermissions = useMemo(
    () => userPermissions ?? [],
    [userPermissions],
  )

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }
    if (requiredPermissions) {
      const hasPermission = requiredPermissions.every((permission) =>
        memoizedPermissions.includes(permission),
      )

      if (!hasPermission) {
        router.push('/not-found')
      }
    }
  }, [token, router, memoizedPermissions, requiredPermissions])

  return token && userPermissions?.length > 0 ? children : null
}

export default PrivateRoute
