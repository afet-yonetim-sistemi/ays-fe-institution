import { useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectPermissions } from '@/modules/auth/authSlice'
import { Permission } from '@/constants/permissions'

const usePermissions = (requiredPermissions: Permission[]): boolean => {
  const permissions = useAppSelector(selectPermissions)

  return useMemo(() => {
    const userPermissions = permissions ?? []
    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    )
  }, [permissions, requiredPermissions])
}

export default usePermissions
