import { store } from '@/store/StoreProvider'
import { Permission } from '@/constants/permissions'

export const checkPermissions = (
  requiredPermissions: Permission[] = Object.values(Permission)
): boolean => {
  const permissions = store.getState().auth.permissions ?? []
  return requiredPermissions.every((permission) =>
    permissions.includes(permission)
  )
}
