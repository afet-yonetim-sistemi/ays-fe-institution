'use client'

import { useCallback, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { formatDateTime } from '@/lib/formatDateTime'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { useToast } from '@/components/ui/use-toast'
import { RoleDetail, RolePermission } from '@/modules/roles/constants/types'
import {
  getPermissions,
  getRoleDetail,
  updateRole,
} from '@/modules/roles/service'
import PermissionCard from '@/modules/roles/components/PermissionCard'
import {
  getLocalizedCategory,
  getLocalizedPermission,
} from '@/lib/localizePermission'
import { FormValidationSchema } from '@/modules/roles/constants/formValidationSchema'
import { NextPage } from 'next'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Permission } from '@/constants/permissions'
import { selectPermissions } from '@/modules/auth/authSlice'
import { useAppSelector } from '@/store/hooks'

const Page: NextPage<{ params: { slug: string; id: string } }> = ({
  params,
}) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const userPermissions = useAppSelector(selectPermissions)
  const form = useForm({
    resolver: zodResolver(FormValidationSchema),
    mode: 'onChange',
  })
  const { control, reset, formState } = form

  const [roleDetail, setRoleDetail] = useState<RoleDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditable, setIsEditable] = useState<boolean>(false)
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [originalPermissions, setOriginalPermissions] = useState<
    RolePermission[]
  >([])
  const [masterSwitch, setMasterSwitch] = useState<boolean>(false)
  const [minPermissionError, setMinPermissionError] = useState<string | null>(
    null
  )

  const createUpdatedData = (
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

  const hasNameChanged = (
    updatedName: string,
    originalName: string
  ): boolean => {
    return updatedName !== originalName
  }

  const havePermissionsChanged = (
    updatedIds: string[],
    originalPermissions: RolePermission[]
  ): boolean => {
    const originalPermissionIds = originalPermissions
      .filter((permission) => permission.isActive)
      .map((permission) => permission.id)

    return (
      updatedIds.length !== originalPermissionIds.length ||
      updatedIds.some((id, index) => id !== originalPermissionIds[index])
    )
  }

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
      .catch(() => {
        toast({
          title: 'Error',
          description: t('permissions.error'),
          variant: 'destructive',
        })
        return []
      })
  }, [t, toast])

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

  useEffect(() => {
    const fetchDetails = async (): Promise<void> => {
      const availablePermissions: RolePermission[] =
        await getAvailableRolePermissions()

      getRoleDetail(params.id)
        .then((response) => {
          const fetchedRoleDetail = response.response

          const updatedPermissions = updatePermissionsActiveStatus(
            fetchedRoleDetail.permissions,
            availablePermissions
          )

          const localizedPermissions = localizePermissions(
            updatedPermissions,
            t
          )

          setRoleDetail({
            ...fetchedRoleDetail,
            permissions: localizedPermissions,
          })
          setOriginalPermissions(localizedPermissions)
          setRolePermissions(localizedPermissions)
        })
        .catch(() => {
          toast({
            title: t('error'),
            description: t('role.error'),
            variant: 'destructive',
          })
        })
        .finally(() => setIsLoading(false))
    }
    fetchDetails()
  }, [getAvailableRolePermissions, params.id, t, toast])

  useEffect(() => {
    if (rolePermissions) {
      const allActive = rolePermissions.every(
        (permission) => permission.isActive
      )
      const allInactive = rolePermissions.every(
        (permission) => !permission.isActive
      )

      setMasterSwitch(allActive)
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
    setMasterSwitch(isActive)
    setRolePermissions((prevPermissions) =>
      prevPermissions.map((permission) => ({
        ...permission,
        isActive,
      }))
    )
  }

  const handleUpdateButtonClick = (): void => {
    setIsEditable(true)
  }

  const handleCancelButtonClick = (): void => {
    setIsEditable(false)
    if (roleDetail) {
      reset({
        name: roleDetail.name,
      })
      setRolePermissions(originalPermissions)
    }
  }

  const handleSaveButtonClick = (): void => {
    if (!roleDetail) return

    const updatedData = createUpdatedData(form, roleDetail, rolePermissions)

    const isNameChanged = hasNameChanged(updatedData.name, roleDetail.name)

    const isPermissionsChanged = havePermissionsChanged(
      updatedData.permissionIds,
      roleDetail.permissions
    )

    if (!isNameChanged && !isPermissionsChanged) {
      toast({
        title: t('error'),
        description: t('role.noChangesError'),
        variant: 'destructive',
      })
      setIsEditable(false)
      return
    }

    updateRole(params.id, updatedData)
      .then((response) => {
        if (response.data.isSuccess) {
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
          setOriginalPermissions(updatedPermissions)

          toast({
            title: t('success'),
            description: t('role.updatedSuccessfully'),
            variant: 'success',
          })
        } else {
          handleCancelButtonClick()
        }
      })
      .catch(() => {
        handleCancelButtonClick()
        toast({
          title: t('error'),
          description: t('role.updateError'),
          variant: 'destructive',
        })
      })
      .finally(() => {
        setIsEditable(false)
      })
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md text-black dark:text-white">
      {isLoading && <LoadingSpinner />}
      {!isLoading && roleDetail && (
        <Form {...form}>
          <form className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{t('role.detailsTitle')}</h1>
              {userPermissions.includes(Permission.ROLE_UPDATE) &&
              !isEditable ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUpdateButtonClick}
                >
                  {t('update')}
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  {minPermissionError && (
                    <p className="text-red-500 text-sm">{minPermissionError}</p>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelButtonClick}
                  >
                    {t('cancel')}
                  </Button>{' '}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveButtonClick}
                    disabled={
                      Boolean(formState.errors.name) ||
                      Boolean(minPermissionError)
                    }
                  >
                    {t('save')}
                  </Button>
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
                        <FormLabel>{t('name')}</FormLabel>
                        <FormControl>
                          <>
                            <Input
                              {...field}
                              disabled={!isEditable}
                              defaultValue={roleDetail.name ?? ''}
                            />
                            {form.formState.errors.name && (
                              <p className="text-red-500 text-sm">
                                {form.formState.errors.name.message as string}
                              </p>
                            )}
                          </>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('role.status')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={
                              t(roleDetail.status.toLowerCase()) ?? ''
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
                        <FormLabel>{t('role.createdUser')}</FormLabel>
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
                        <FormLabel>{t('createDateTime')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={
                              roleDetail.createdAt
                                ? formatDateTime(roleDetail.createdAt)
                                : ''
                            }
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
                        <FormLabel>{t('role.updatedUser')}</FormLabel>
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
                        <FormLabel>{t('updateDateTime')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={
                              roleDetail.updatedAt
                                ? formatDateTime(roleDetail.updatedAt)
                                : ''
                            }
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
                  <CardTitle>{t('role.permissions')}</CardTitle>
                  <Switch
                    className="ml-4"
                    disabled={!isEditable}
                    checked={masterSwitch}
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
                        isEditable={isEditable}
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
