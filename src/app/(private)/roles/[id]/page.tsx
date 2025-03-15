'use client'

import { Button } from '@/components/ui/button'
import ButtonDialog from '@/components/ui/button-dialog'
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
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { Switch } from '@/components/ui/switch'
import { Permission } from '@/constants/permissions'
import { formatDateTime } from '@/lib/dataFormatters'
import { showErrorToast, showSuccessToast } from '@/lib/showToast'
import {
  getLocalizedCategory,
  getLocalizedPermission,
} from '@/lib/localizePermission'
import { selectPermissions } from '@/modules/auth/authSlice'
import PermissionCard from '@/modules/roles/components/PermissionCard'
import { FormValidationSchema } from '@/modules/roles/constants/formValidationSchema'
import { RoleDetail, RolePermission } from '@/modules/roles/constants/types'
import {
  activateRole,
  deactivateRole,
  deleteRole,
  getPermissions,
  getRoleDetail,
  updateRole,
} from '@/modules/roles/service'
import { useAppSelector } from '@/store/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const Page: NextPage<{ params: { slug: string; id: string } }> = ({
  params,
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const userPermissions = useAppSelector(selectPermissions)
  const form = useForm({
    resolver: zodResolver(FormValidationSchema),
    mode: 'onChange',
  })
  const { control, reset, formState } = form

  const [roleDetail, setRoleDetail] = useState<RoleDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRoleEditable, setIsRoleEditable] = useState<boolean>(false)

  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [originalRolePermissions, setOriginalRolePermissions] = useState<
    RolePermission[]
  >([])
  const [masterPermissionsSwitch, setMasterPermissionsSwitch] =
    useState<boolean>(false)
  const [minPermissionError, setMinPermissionError] = useState<string | null>(
    null
  )

  const [fetchedRoleDetail, setFetchedRoleDetail] = useState<RoleDetail | null>(
    null
  )
  const [availablePermissions, setAvailablePermissions] = useState<
    RolePermission[]
  >([])

  const getAvailableRolePermissions = useCallback(async (): Promise<
    RolePermission[]
  > => {
    return getPermissions()
      .then((response) => {
        const permissions = response.response
        return permissions.map((permission: RolePermission) => ({
          id: permission.id,
          name: permission.name,
          category: permission.category,
          isActive: false,
        }))
      })
      .catch((error) => {
        showErrorToast(error, 'common.error.fetch')
        return []
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createUpdatedRoleData = (
    form: UseFormReturn,
    roleDetail: RoleDetail,
    permissions: RolePermission[]
  ): { name: string; permissionIds: string[] } => {
    return {
      name: form.getValues('name') || roleDetail.name,
      permissionIds: permissions
        .filter((permission) => permission.isActive)
        .map((permission) => permission.id),
    }
  }

  const hasRoleNameChanged = (
    updatedRoleName: string,
    originalRoleName: string
  ): boolean => {
    return updatedRoleName !== originalRoleName
  }

  const haveRolePermissionsChanged = (
    updatedPermissionIds: string[],
    originalPermissions: RolePermission[]
  ): boolean => {
    const originalPermissionIds = originalPermissions
      .filter((permission) => permission.isActive)
      .map((permission) => permission.id)

    return (
      updatedPermissionIds.length !== originalPermissionIds.length ||
      updatedPermissionIds.some(
        (id, index) => id !== originalPermissionIds[index]
      )
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

  const localizePermissions = (
    permissions: RolePermission[],
    t: (key: string) => string
  ): RolePermission[] => {
    return permissions.map((permission) => ({
      ...permission,
      name: getLocalizedPermission(permission.name, t),
      category: getLocalizedCategory(permission.category, t),
    }))
  }

  const updatePermissionsActiveStatus = (
    permissions: RolePermission[],
    initialPermissions: RolePermission[]
  ): RolePermission[] => {
    const apiPermissionsMap: Record<string, { id: string; name: string }> = {}

    permissions.forEach(({ id, name }) => {
      apiPermissionsMap[id] = { id, name }
    })

    return initialPermissions.map((permission): RolePermission => {
      const apiPermission = apiPermissionsMap[permission.id]
      return {
        ...permission,
        id: apiPermission ? apiPermission.id : permission.id,
        isActive: !!apiPermission,
      }
    })
  }

  const enhanceRolePermissions = useCallback(
    (
      fetchedRoleDetail: RoleDetail,
      availablePermissions: RolePermission[]
    ): void => {
      const updatedPermissions = updatePermissionsActiveStatus(
        fetchedRoleDetail.permissions,
        availablePermissions
      )

      const localizedPermissions = localizePermissions(updatedPermissions, t)

      setRoleDetail({
        ...fetchedRoleDetail,
        permissions: localizedPermissions,
      })
      setOriginalRolePermissions(localizedPermissions)
      setRolePermissions(localizedPermissions)
    },
    [t]
  )

  useEffect(() => {
    const fetchDetails = async (): Promise<void> => {
      const availablePermissions: RolePermission[] =
        await getAvailableRolePermissions()

      getRoleDetail(params.id)
        .then((response) => {
          const fetchedRoleDetail = response.response
          setFetchedRoleDetail(fetchedRoleDetail)
          setAvailablePermissions(availablePermissions)

          enhanceRolePermissions(fetchedRoleDetail, availablePermissions)
        })
        .catch((error) => {
          showErrorToast(error, 'common.error.fetch')
        })
        .finally(() => setIsLoading(false))
    }
    fetchDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAvailableRolePermissions, params.id])

  useEffect(() => {
    if (fetchedRoleDetail && availablePermissions.length > 0) {
      if (rolePermissions !== originalRolePermissions) {
        const updatedPermissions = updatePermissionsActiveStatus(
          fetchedRoleDetail.permissions,
          availablePermissions
        )

        const localizedPermissions = localizePermissions(updatedPermissions, t)

        setRoleDetail({
          ...fetchedRoleDetail,
          permissions: localizedPermissions,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enhanceRolePermissions,
    fetchedRoleDetail,
    availablePermissions,
    rolePermissions,
  ])

  useEffect(() => {
    if (rolePermissions) {
      const allActive = rolePermissions.every(
        (permission) => permission.isActive
      )
      const allInactive = rolePermissions.every(
        (permission) => !permission.isActive
      )

      setMasterPermissionsSwitch(allActive)
      if (allInactive) {
        setMinPermissionError(t('role.minPermissionError'))
      } else {
        setMinPermissionError(null)
      }
    }
  }, [rolePermissions, t])

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

  const handleMasterSwitchChange = (isActive: boolean): void => {
    setMasterPermissionsSwitch(isActive)
    setRolePermissions((prevPermissions) =>
      prevPermissions.map((permission) => ({
        ...permission,
        isActive,
      }))
    )
  }

  const handleUpdateButtonClick = (): void => {
    setIsRoleEditable(true)
  }

  const handleCancelButtonClick = (): void => {
    setIsRoleEditable(false)
    if (roleDetail) {
      reset({
        name: roleDetail.name,
      })
      setRolePermissions(originalRolePermissions)
    }
  }

  const handleSaveButtonClick = (): void => {
    if (!roleDetail) return

    const updatedData = createUpdatedRoleData(form, roleDetail, rolePermissions)
    const isNameChanged = hasRoleNameChanged(updatedData.name, roleDetail.name)
    const isPermissionsChanged = haveRolePermissionsChanged(
      updatedData.permissionIds,
      roleDetail.permissions
    )

    if (!isNameChanged && !isPermissionsChanged) {
      showErrorToast(undefined, 'common.error.noChange')
      setIsRoleEditable(false)
      return
    }

    updateRole(params.id, updatedData)
      .then((response) => {
        if (response.isSuccess) {
          const updatedPermissions = rolePermissions.map((permission) => ({
            ...permission,
            isActive: updatedData.permissionIds.includes(permission.id),
          }))

          setRoleDetail({
            ...roleDetail,
            name: updatedData.name,
            permissions: updatedPermissions,
          })
          setRolePermissions(updatedPermissions)
          setOriginalRolePermissions(updatedPermissions)

          showSuccessToast('role.updateSuccess')
          setIsRoleEditable(false)
        } else {
          showErrorToast(undefined, 'role.updateError')
        }
      })
      .catch((error) => {
        showErrorToast(error, 'role.updateError')
      })
  }

  const handleDeleteConfirm = (): void => {
    deleteRole(params.id)
      .then((response) => {
        if (response.isSuccess) {
          showSuccessToast('role.deleteSuccess')
          router.push('/roles')
        } else {
          showErrorToast()
        }
      })
      .catch((error) => {
        showErrorToast(error)
      })
  }

  const refreshRoleStatus = (status: string): void => {
    reset({
      status: t(status),
    })
    if (roleDetail) {
      setRoleDetail({
        ...roleDetail,
        status: status.toUpperCase(),
      })
    }
  }

  const handleActivateRole = (): void => {
    activateRole(params.id)
      .then((response) => {
        if (response.isSuccess) {
          showSuccessToast('role.activateSuccess')
          refreshRoleStatus('active')
        } else {
          showErrorToast()
        }
      })
      .catch((error) => {
        showErrorToast(error)
      })
  }

  const handleDeactivateRole = (): void => {
    deactivateRole(params.id)
      .then((response) => {
        if (response.isSuccess) {
          showSuccessToast('role.deactivateSuccess')
          refreshRoleStatus('passive')
        } else {
          showErrorToast()
        }
      })
      .catch((error) => {
        showErrorToast(error)
      })
  }

  const renderRoleUpdateButtons = () => {
    if (!userPermissions.includes(Permission.ROLE_UPDATE)) return null

    if (!isRoleEditable) {
      return (
        <Button
          type="button"
          variant="outline"
          onClick={handleUpdateButtonClick}
        >
          {t('common.update')}
        </Button>
      )
    }

    return (
      <div className="flex items-center gap-4">
        {minPermissionError && (
          <p className="text-red-500 text-sm">{minPermissionError}</p>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={handleCancelButtonClick}
        >
          {t('common.cancel')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleSaveButtonClick}
          disabled={
            Boolean(formState.errors.name) || Boolean(minPermissionError)
          }
        >
          {t('common.save')}
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md text-black dark:text-white">
      {isLoading && <LoadingSpinner />}
      {!isLoading && roleDetail && (
        <Form {...form}>
          <form className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{t('role.detailsTitle')}</h1>
              {roleDetail.status !== 'DELETED' && (
                <div className="flex items-center gap-4">
                  {userPermissions.includes(Permission.ROLE_UPDATE) &&
                    !isRoleEditable &&
                    (roleDetail.status === 'ACTIVE' ? (
                      <ButtonDialog
                        triggerText={'common.deactivate'}
                        title={'role.deactivateConfirm'}
                        onConfirm={handleDeactivateRole}
                        variant={'outline'}
                      />
                    ) : (
                      <ButtonDialog
                        triggerText={'common.activate'}
                        title={'role.activateConfirm'}
                        onConfirm={handleActivateRole}
                        variant={'outline'}
                      />
                    ))}
                  {userPermissions.includes(Permission.ROLE_DELETE) &&
                    !isRoleEditable && (
                      <ButtonDialog
                        triggerText={'common.delete'}
                        title={'role.deleteConfirm'}
                        onConfirm={handleDeleteConfirm}
                        variant={'destructive'}
                      />
                    )}
                  {renderRoleUpdateButtons()}
                </div>
              )}
            </div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t('role.information')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('role.name')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isRoleEditable}
                            defaultValue={roleDetail.name ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('status.title')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            value={
                              t(`status.${roleDetail.status.toLowerCase()}`) ??
                              ''
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="createdUser"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('common.createdUser')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={roleDetail.createdUser ?? ''}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="createdAt"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('common.createdAt')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={formatDateTime(roleDetail.createdAt)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="updatedUser"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('common.updatedUser')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={roleDetail.updatedUser ?? ''}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="updateAt"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('common.updatedAt')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={formatDateTime(roleDetail.updatedAt)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center">
                  <CardTitle>{t('role.permission')}</CardTitle>
                  <Switch
                    className="ml-4"
                    disabled={!isRoleEditable}
                    checked={masterPermissionsSwitch}
                    onCheckedChange={(isActive) =>
                      handleMasterSwitchChange(isActive)
                    }
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(categorizePermissions(rolePermissions)).map(
                    ([category, permissions]) => (
                      <PermissionCard
                        key={category}
                        category={t(category)}
                        permissions={permissions}
                        isEditable={isRoleEditable}
                        onPermissionToggle={handlePermissionToggle}
                        onCategoryToggle={handleCategoryToggle}
                      />
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      )}
    </div>
  )
}

export default Page
