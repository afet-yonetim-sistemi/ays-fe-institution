'use client'

import { LoadingSpinner } from '@/components/custom/loadingSpinner'
import { useCreatePage } from '@/hooks/useCreatePage'
import PermissionCard from '@/modules/roles/components/PermissionCard'
import {
  roleFormConfig,
  RoleFormValues,
} from '@/modules/roles/constants/formConfig'
import { usePermissionSelection } from '@/modules/roles/hooks/usePermissionSelection'
import { createRole } from '@/modules/roles/service'
import { Button } from '@/shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shadcn/ui/form'
import { Input } from '@/shadcn/ui/input'
import { Switch } from '@/shadcn/ui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const Page = (): React.ReactNode => {
  const { t } = useTranslation()
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormConfig.validationSchemaCreate),
    mode: 'onChange',
    defaultValues: roleFormConfig.getDefaultValues(),
  })
  const { control, formState } = form

  const handlePermissionSelectionChange = useCallback(
    (ids: string[]) => {
      form.setValue('permissionIds', ids, { shouldValidate: true })
    },
    [form]
  )

  const {
    permissionIsLoading,
    masterPermissionsSwitch,
    permissionError,
    handlePermissionToggle,
    handleCategoryToggle,
    handleMasterSwitchChange,
    categorizedPermissions,
  } = usePermissionSelection({
    onSelectionChange: handlePermissionSelectionChange,
  })

  const hasFormErrors = Object.keys(formState.errors).length > 0
  const isCreateDisabled = hasFormErrors || permissionError !== null

  const { handleCreate: createRoleHandler } = useCreatePage<{
    name: string
    permissionIds: string[]
  }>({
    createItem: createRole,
    redirectPath: '/roles',
    successMessage: 'role.createSuccess',
    errorMessage: 'role.createError',
  })

  const handleCreate = (): void => {
    const formValues = form.getValues()
    const payload = roleFormConfig.getCreatePayload(formValues)

    createRoleHandler(payload)
  }

  return (
    <Form {...form}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('role.createTitle')}</h1>
        <Button onClick={handleCreate} disabled={isCreateDisabled}>
          {t('common.create')}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('role.name')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CardTitle>{t('role.permissions')}</CardTitle>
              <div className="ml-4 flex items-center gap-2">
                <Switch
                  checked={masterPermissionsSwitch}
                  onCheckedChange={(isActive) =>
                    handleMasterSwitchChange(isActive)
                  }
                />
                {permissionError && (
                  <p className="text-sm text-destructive">{permissionError}</p>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {permissionIsLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(categorizedPermissions).map(
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
          )}
        </CardContent>
      </Card>
    </Form>
  )
}

export default Page
