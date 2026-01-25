import {
  getLocalizedCategory,
  getLocalizedPermission,
} from '@/lib/localizePermission'
import { showErrorToast } from '@/lib/showToast'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RolePermission } from '../constants/types'
import { getPermissions } from '../service'

interface UsePermissionSelectionReturn {
  rolePermissions: RolePermission[]
  permissionIsLoading: boolean
  masterPermissionsSwitch: boolean
  permissionError: string | null
  selectedPermissions: string[]
  handlePermissionToggle: (id: string) => void
  handleCategoryToggle: (category: string, isActive: boolean) => void
  handleMasterSwitchChange: (isActive: boolean) => void
  categorizedPermissions: Record<string, RolePermission[]>
  setInitialPermissions: (permissions: RolePermission[]) => void
}

interface UsePermissionSelectionOptions {
  onSelectionChange?: (ids: string[]) => void
}

export function usePermissionSelection(
  options: UsePermissionSelectionOptions = {}
): UsePermissionSelectionReturn {
  const { onSelectionChange } = options
  const { t } = useTranslation()
  const [allPermissions, setAllPermissions] = useState<RolePermission[]>([])
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    []
  )
  const [permissionIsLoading, setPermissionIsLoading] = useState(true)

  useEffect(() => {
    getPermissions()
      .then((response) => {
        setAllPermissions(response.response)
        setPermissionIsLoading(false)
      })
      .catch((error) => {
        showErrorToast(error, 'common.error.fetch')
        setPermissionIsLoading(false)
      })
  }, [])

  const setInitialPermissions = useCallback(
    (permissions: RolePermission[]) => {
      const ids = permissions.map((p) => p.id)
      setSelectedPermissionIds(ids)
      onSelectionChange?.(ids)
    },
    [onSelectionChange]
  )

  const rolePermissions = useMemo(() => {
    return allPermissions.map((p) => ({
      ...p,
      isActive: selectedPermissionIds.includes(p.id),
    }))
  }, [allPermissions, selectedPermissionIds])

  const localizedPermissions = useMemo(() => {
    return rolePermissions.map((permission) => ({
      ...permission,
      name: getLocalizedPermission(permission.name, t),
      category: getLocalizedCategory(permission.category, t),
    }))
  }, [rolePermissions, t])

  const categorizedPermissions = useMemo(() => {
    return localizedPermissions.reduce<Record<string, RolePermission[]>>(
      (acc, permission) => {
        if (!acc[permission.category]) {
          acc[permission.category] = []
        }
        acc[permission.category].push(permission)
        return acc
      },
      {}
    )
  }, [localizedPermissions])

  const masterPermissionsSwitch = useMemo(() => {
    return (
      rolePermissions.length > 0 && rolePermissions.every((p) => p.isActive)
    )
  }, [rolePermissions])

  const permissionError = useMemo(() => {
    if (rolePermissions.length === 0) return null
    const anyActive = rolePermissions.some((p) => p.isActive)
    return anyActive ? null : t('role.minPermissionError')
  }, [rolePermissions, t])

  const selectedPermissions = useMemo(() => {
    return selectedPermissionIds
  }, [selectedPermissionIds])

  const handlePermissionToggle = useCallback(
    (id: string): void => {
      setSelectedPermissionIds((prev) => {
        const next = prev.includes(id)
          ? prev.filter((pId) => pId !== id)
          : [...prev, id]
        onSelectionChange?.(next)
        return next
      })
    },
    [onSelectionChange]
  )

  const handleCategoryToggle = useCallback(
    (category: string, isActive: boolean): void => {
      const categoryPermissionIds = allPermissions
        .filter((p) => getLocalizedCategory(p.category, t) === category)
        .map((p) => p.id)

      setSelectedPermissionIds((prev) => {
        let next: string[]
        if (isActive) {
          next = Array.from(new Set([...prev, ...categoryPermissionIds]))
        } else {
          next = prev.filter((id) => !categoryPermissionIds.includes(id))
        }
        onSelectionChange?.(next)
        return next
      })
    },
    [allPermissions, t, onSelectionChange]
  )

  const handleMasterSwitchChange = useCallback(
    (isActive: boolean): void => {
      const next = isActive ? allPermissions.map((p) => p.id) : []
      setSelectedPermissionIds(next)
      onSelectionChange?.(next)
    },
    [allPermissions, onSelectionChange]
  )

  return {
    rolePermissions: localizedPermissions,
    permissionIsLoading,
    masterPermissionsSwitch,
    permissionError,
    selectedPermissions,
    handlePermissionToggle,
    handleCategoryToggle,
    handleMasterSwitchChange,
    categorizedPermissions,
    setInitialPermissions,
  }
}
