'use client'

import { useCallback, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { formatDateTime } from '@/lib/formatDateTime'
import {
  FormItem,
  FormField,
  FormControl,
  FormLabel,
  Form,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { useToast } from '@/components/ui/use-toast'
import { RoleDetail, RolePermission } from '@/modules/roles/constants/types'
import { getRoleDetail, getPermissions } from '@/modules/roles/service'
import { Permission } from '@/constants/permissions'
import PrivateRoute from '@/app/hocs/isAuth'
import PermissionCard from '@/modules/roles/components/PermissionCard'
import {
  getLocalizedCategory,
  getLocalizedPermission,
} from '@/lib/localizePermission'
import { FormValidationSchema } from '@/modules/roles/constants/formValidationSchema'
import { NextPage } from 'next'

const Page: NextPage<{ params: { slug: string; id: string } }> = ({
  params,
}) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(FormValidationSchema),
  })
  const { control } = form

  const [roleDetail, setRoleDetail] = useState<RoleDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

    const updatedPermissions = initialPermissions.map(
      (permission): RolePermission => {
        const apiPermission = apiPermissionsMap[permission.id]
        return {
          ...permission,
          id: apiPermission ? apiPermission.id : permission.id,
          isActive: !!apiPermission,
        }
      }
    )

    return updatedPermissions
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

  return (
    <PrivateRoute requiredPermissions={[Permission.ROLE_DETAIL]}>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md text-black dark:text-white">
        {isLoading && <LoadingSpinner />}
        {!isLoading && roleDetail && (
          <Form {...form}>
            <form className="space-y-6">
              <h1 className="text-2xl font-bold mb-6">
                {t('role.detailsTitle')}
              </h1>
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
                            <Input
                              {...field}
                              disabled
                              value={t(roleDetail.name) ?? ''}
                            />
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
                              value={t(roleDetail.status.toLowerCase()) ?? ''}
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
                  <CardTitle>{t('role.permissions')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.entries(
                    categorizePermissions(roleDetail.permissions)
                  ).map(([category, permissions]) => (
                    <PermissionCard
                      key={category}
                      category={t(category)}
                      permissions={permissions}
                    />
                  ))}
                </CardContent>
              </Card>
            </form>
          </Form>
        )}
      </div>
    </PrivateRoute>
  )
}

export default Page
