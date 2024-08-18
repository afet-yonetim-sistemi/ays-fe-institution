'use client'

import { useEffect, useState } from 'react'
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
import { FormSchema } from '@/modules/adminRegistrationApplications/constants/formSchema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { useToast } from '@/components/ui/use-toast'
import { RoleDetail, RolePermission } from '@/modules/roleListing/constants/types'
import { getRoleDetail } from '@/modules/roleListing/service'
import { Permission, permissionsByCategory } from '@/constants/permissions'
import PrivateRoute from '@/app/hocs/isAuth'
import PermissionCard from '@/modules/roleListing/components/PermissionCard'
import { getLocalizedCategory, getLocalizedPermission } from '@/lib/localizePermission'

const Page = ({ params }: { params: { slug: string; id: string } }) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(FormSchema),
  })
  const { control } = form

  const [roleDetail, setRoleDetail] = useState<RoleDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = () => {
      getRoleDetail(params.id)
        .then((response) => {
            const fetchedRoleDetail = response.response;
            const initialPermissions = initializePermissions();
            const processedApiPermissions = processApiPermissions(
              fetchedRoleDetail.permissions,
              initialPermissions,
              t
            );
            const localizedPermissions = localizePermissions(processedApiPermissions, t)
            setRoleDetail({
              ...fetchedRoleDetail,
              permissions: localizedPermissions,
            });
        })
        .catch(() => {
          toast({
            title: t('error'),
            description: t('applicationError'),
            variant: 'destructive',
          });
        })
        .finally(() => setIsLoading(false));
    }
    fetchDetails();
  }, [params.id, t, toast]);

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
                      name="createDate"
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
                      name="updateDate"
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
                  {Object.entries(categorizePermissions(roleDetail.permissions)).map(([category, permissions]) => (
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

const initializePermissions = (): RolePermission[] => {
  return Object.entries(permissionsByCategory).flatMap(([category, permissions]) =>
    permissions.map((permission) => ({
      id: permission,
      name: permission,
      category: category,
      isActive: false,
    }))
  );
};

const categorizePermissions = (permissions: RolePermission[]) => {
  return permissions.reduce<Record<string, RolePermission[]>>((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});
};

const localizePermissions = (permissions: RolePermission[], t: (key: string) => string) => {
  return permissions.map(permission => ({
    ...permission,
    name: getLocalizedPermission(permission.name, t),
    category: getLocalizedCategory(permission.category, t)
  }));
};

const processApiPermissions = (permissions: RolePermission[], initialPermissions: RolePermission[], t: (key: string) => string) => {
  const apiPermissionsMap: Record<string, { id: string; name: string }> = {};
  
  permissions.forEach(({ id, name }) => {
    apiPermissionsMap[name] = { id, name };
  });

  const updatedPermissions = initialPermissions.map((permission) => {
    const apiPermission = apiPermissionsMap[permission.name];
    return {
      ...permission,
      id: apiPermission ? apiPermission.id : permission.id,
      isActive: !!apiPermission,
    };
  });

  return updatedPermissions;
};