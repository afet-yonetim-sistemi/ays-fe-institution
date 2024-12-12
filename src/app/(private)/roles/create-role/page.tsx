'use client'

import { useEffect, useState } from 'react'
import { CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { handleApiError } from '@/lib/handleApiError'
import {
  getLocalizedCategory,
  getLocalizedPermission,
} from '@/lib/localizePermission'
import PermissionCard from '@/modules/roles/components/PermissionCard'
import { CreateRoleSchema } from '@/modules/roles/constants/formValidationSchema'
import { RolePermission } from '@/modules/roles/constants/types'
import { getPermissions } from '@/modules/roles/service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const form = useForm({
    resolver: zodResolver(CreateRoleSchema),
    mode: 'onChange',
  })
  const { control, formState } = form

  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])

  useEffect(() => {
    const fetchPermissions = async () => {
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
          const localizedPermissions = permissions.map((permission) => ({
            ...permission,
            name: getLocalizedPermission(permission.name, t),
            category: getLocalizedCategory(permission.category, t),
          }))
          setRolePermissions(localizedPermissions)
        })
        .catch((error) => {
          handleApiError(error, { description: t('permissions.error') })
        })
    }

    fetchPermissions()
  }, [t])

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

  return (
    <Form {...form}>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="sm:col-span-1">
            <FormLabel>{t('name')}</FormLabel>
            <FormControl>
              <>
                <Input {...field} defaultValue={''} />
                {formState.errors.name && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.name.message as string}
                  </p>
                )}
              </>
            </FormControl>
          </FormItem>
        )}
      />
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
    </Form>
  )
}

export default Page
