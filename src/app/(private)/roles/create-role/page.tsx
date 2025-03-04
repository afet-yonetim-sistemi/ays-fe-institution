'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/useToast'
import { handleErrorToast } from '@/lib/handleErrorToast'
import {
  getLocalizedCategory,
  getLocalizedPermission,
} from '@/lib/localizePermission'
import PermissionCard from '@/modules/roles/components/PermissionCard'
import { CreateRoleSchema } from '@/modules/roles/constants/formValidationSchema'
import { RolePermission } from '@/modules/roles/constants/types'
import { createRole, getPermissions } from '@/modules/roles/service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(CreateRoleSchema),
    mode: 'onChange',
  })
  const { control, watch, formState } = form

  const [fetchedRolePermissions, setFetchedRolePermissions] = useState<
    RolePermission[]
  >([])
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [masterPermissionsSwitch, setMasterPermissionsSwitch] =
    useState<boolean>(false)
  const [minPermissionError, setMinPermissionError] = useState<string | null>(
    null
  )

  const isCreateDisabled = !formState.isValid || minPermissionError !== null

  useEffect(() => {
    getPermissions()
      .then((response) => {
        const permissions = response.response.map(
          (permission: RolePermission) => ({
            id: permission.id,
            name: permission.name,
            category: permission.category,
            isActive: false,
          })
        )
        setFetchedRolePermissions(permissions)
      })
      .catch((error) => {
        handleErrorToast(error, { description: 'permissions.error' })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const localizedPermissions = fetchedRolePermissions.map((permission) => ({
      ...permission,
      name: getLocalizedPermission(permission.name, t),
      category: getLocalizedCategory(permission.category, t),
    }))
    setRolePermissions(localizedPermissions)
  }, [fetchedRolePermissions, t])

  useEffect(() => {
    if (rolePermissions.length > 0) {
      const allActive = rolePermissions.every(
        (permission) => permission.isActive
      )
      const allInactive = rolePermissions.every(
        (permission) => !permission.isActive
      )

      setMasterPermissionsSwitch(allActive)
      setMinPermissionError(allInactive ? t('role.minPermissionError') : null)
    }
  }, [rolePermissions, t])

  const handleMasterSwitchChange = (isActive: boolean): void => {
    setMasterPermissionsSwitch(isActive)
    setRolePermissions((prevPermissions) =>
      prevPermissions.map((permission) => ({
        ...permission,
        isActive,
      }))
    )
  }

  const categorizePermissions = (
    permissions: RolePermission[]
  ): Record<string, RolePermission[]> => {
    return permissions.reduce<Record<string, RolePermission[]>>(
      (acc, permission) => {
        if (!acc[permission.category]) {
          acc[permission.category] = []
        }
        acc[permission.category].push(permission)
        return acc
      },
      {}
    )
  }

  const handlePermissionToggle = (id: string): void => {
    setRolePermissions((prevPermissions) =>
      prevPermissions.map((permission) =>
        permission.id === id
          ? { ...permission, isActive: !permission.isActive }
          : permission
      )
    )
  }

  const handleCategoryToggle = (category: string, isActive: boolean): void => {
    setRolePermissions((prevPermissions) =>
      prevPermissions.map((permission) =>
        permission.category === category
          ? { ...permission, isActive }
          : permission
      )
    )
  }

  const handleCreate = (): void => {
    const name = watch('name')
    const activePermissionIds = rolePermissions
      .filter((permission) => permission.isActive)
      .map((permission) => permission.id)

    if (activePermissionIds.length === 0) {
      setMinPermissionError(t('role.minPermissionError'))
      return
    }

    createRole({ name, permissionIds: activePermissionIds })
      .then(() => {
        toast({
          title: 'success',
          description: 'role.createdSuccessfully',
          variant: 'success',
        })
        router.push('/roles')
      })
      .catch((error) => {
        handleErrorToast(error, { description: 'role.createError' })
      })
  }

  return (
    <Form {...form}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('role.createTitle')}</h1>
        <Button onClick={handleCreate} disabled={isCreateDisabled}>
          {t('common.create')}
        </Button>
      </div>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('name')}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CardTitle>{t('role.permissions')}</CardTitle>
              <div className="ml-4 flex items-center gap-2">
                <Switch
                  checked={masterPermissionsSwitch}
                  onCheckedChange={(isActive) =>
                    handleMasterSwitchChange(isActive)
                  }
                />
                {minPermissionError && (
                  <p className="text-destructive text-sm">
                    {minPermissionError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(categorizePermissions(rolePermissions)).map(
              ([category, permissions]) => (
                <PermissionCard
                  key={category}
                  category={category}
                  permissions={permissions}
                  isEditable={true}
                  onPermissionToggle={handlePermissionToggle}
                  onCategoryToggle={handleCategoryToggle}
                />
              )
            )}
          </div>
        </CardContent>
      </Card>
    </Form>
  )
}

export default Page
