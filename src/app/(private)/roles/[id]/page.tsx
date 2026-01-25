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
import { useDetailPage } from '@/hooks/useDetailPage'
import { useFormManager } from '@/hooks/useFormManager'
import { formatDateTime } from '@/lib/dataFormatters'
import { selectPermissions } from '@/modules/auth/authSlice'
import PermissionCard from '@/modules/roles/components/PermissionCard'
import {
  roleFormConfig,
  RoleFormValues,
} from '@/modules/roles/constants/formConfig'
import { RoleDetail } from '@/modules/roles/constants/types'
import { usePermissionSelection } from '@/modules/roles/hooks/usePermissionSelection'
import {
  activateRole,
  deactivateRole,
  deleteRole,
  getRoleDetail,
  updateRole,
} from '@/modules/roles/service'
import { useAppSelector } from '@/store/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const Page = ({
  params,
}: {
  params: { slug: string; id: string }
}): JSX.Element => {
  const { t } = useTranslation()
  const userPermissions = useAppSelector(selectPermissions)
  const [initialRoleValues, setInitialRoleValues] = useState<RoleDetail | null>(
    null
  )

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormConfig.validationSchemaDetail),
    mode: 'onChange',
  })
  const { control, reset, getValues, setValue } = form

  const handlePermissionSelectionChange = useCallback(
    (ids: string[]) => {
      setValue('permissionIds', ids, { shouldValidate: true })
    },
    [setValue]
  )

  const {
    permissionIsLoading,
    masterPermissionsSwitch,
    handlePermissionToggle,
    handleCategoryToggle,
    handleMasterSwitchChange,
    categorizedPermissions,
    setInitialPermissions,
    permissionError,
  } = usePermissionSelection({
    onSelectionChange: handlePermissionSelectionChange,
  })

  const {
    detail: roleDetail,
    isLoading,
    error,
    isEditable: isRoleEditable,
    setIsEditable: setIsRoleEditable,
    fetchDetails,
    handleUpdate: updateHandler,
    statusOperations,
    handleDelete: deleteHandler,
    handleCancel: cancelHandler,
  } = useDetailPage<RoleDetail, { name: string; permissionIds: string[] }>({
    fetchDetail: getRoleDetail,
    updateItem: updateRole,
    deleteItem: deleteRole,
    redirectPath: '/roles',
    autoRefreshAfterUpdate: true,
    statusOperations: {
      activate: {
        handler: activateRole,
        successStatus: 'ACTIVE',
        successMessage: 'role.activateSuccess',
      },
      deactivate: {
        handler: deactivateRole,
        successStatus: 'PASSIVE',
        successMessage: 'role.deactivateSuccess',
      },
    },
    onSuccess: {
      fetch: (data) => {
        setInitialRoleValues(data)
        reset(roleFormConfig.getDefaultValues(data))
        setInitialPermissions(data.permissions)
      },
      update: (updatedData) => {
        setInitialRoleValues(updatedData)
      },
    },
    successMessages: {
      update: 'role.updateSuccess',
      delete: 'role.deleteSuccess',
    },
    errorMessages: {
      update: 'role.updateError',
      fetch: 'common.error.fetch',
    },
  })

  const { isSaveButtonDisabled } = useFormManager<RoleFormValues, RoleDetail>({
    form,
    initialValues: initialRoleValues,
    hasFormChanged: (currentValues, initialValues) => {
      const current = roleFormConfig.getCurrentValues(
        currentValues,
        initialValues
      )
      return roleFormConfig.hasFormChanged(current, initialValues)
    },
    isSaveButtonDisabled: (isFormChanged, formErrors) => {
      return (
        roleFormConfig.isSaveButtonDisabled(isFormChanged, formErrors) ||
        permissionError !== null
      )
    },
  })

  useEffect(() => {
    fetchDetails(params.id)
  }, [params.id, fetchDetails])

  const handleUpdateButtonClick = (): void => {
    setIsRoleEditable(true)
  }

  const handleCancelButtonClick = (): void => {
    if (roleDetail) {
      reset(roleFormConfig.getDefaultValues(roleDetail))
      setInitialPermissions(roleDetail.permissions)
    }
    cancelHandler()
  }

  const handleSaveButtonClick = (): void => {
    const formValues = getValues()
    const payload = roleFormConfig.getPayload(formValues)
    updateHandler(params.id, payload)
  }

  const handleDeleteRole = (): void => {
    deleteHandler(params.id)
  }

  const handleActivateRole = (): void => {
    if (statusOperations.activate) {
      statusOperations.activate(params.id)
    }
  }

  const handleDeactivateRole = (): void => {
    if (statusOperations.deactivate) {
      statusOperations.deactivate(params.id)
    }
  }

  const renderRoleUpdateButtons = (): JSX.Element | null => {
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
          disabled={isSaveButtonDisabled}
        >
          {t('common.save')}
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-md bg-white p-6 text-black shadow-md dark:bg-gray-800 dark:text-white">
      {isLoading && <LoadingSpinner />}
      {!isLoading && !error && roleDetail && (
        <Form {...form}>
          <form className="space-y-6">
            <div className="mb-6 flex items-center justify-between">
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
                        onConfirm={handleDeleteRole}
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
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('role.name')}</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isRoleEditable} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem className="sm:col-span-1">
                    <FormLabel>{t('role.status')}</FormLabel>
                    <Input
                      disabled
                      value={
                        t(`status.${roleDetail.status.toLowerCase()}`) ?? ''
                      }
                    />
                  </FormItem>
                  <div className="grid grid-cols-4 gap-6 sm:col-span-3">
                    <FormItem className="sm:col-span-1">
                      <FormLabel>{t('common.createdUser')}</FormLabel>
                      <Input
                        disabled
                        value={roleDetail.createdUser ?? ''}
                        readOnly
                      />
                    </FormItem>
                    <FormItem className="sm:col-span-1">
                      <FormLabel>{t('common.createdAt')}</FormLabel>
                      <Input
                        disabled
                        value={formatDateTime(roleDetail.createdAt)}
                        readOnly
                      />
                    </FormItem>
                    <FormItem className="sm:col-span-1">
                      <FormLabel>{t('common.updatedUser')}</FormLabel>
                      <Input
                        disabled
                        value={roleDetail.updatedUser ?? ''}
                        readOnly
                      />
                    </FormItem>
                    <FormItem className="sm:col-span-1">
                      <FormLabel>{t('common.updatedAt')}</FormLabel>
                      <Input
                        disabled
                        value={formatDateTime(roleDetail.updatedAt)}
                        readOnly
                      />
                    </FormItem>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center">
                  <CardTitle>
                    {isRoleEditable
                      ? t('role.permissions')
                      : t('role.permission')}
                  </CardTitle>
                  <div className="ml-4 flex items-center gap-2">
                    <Switch
                      disabled={!isRoleEditable}
                      checked={masterPermissionsSwitch}
                      onCheckedChange={(isActive) =>
                        handleMasterSwitchChange(isActive)
                      }
                    />
                    {isRoleEditable && permissionError && (
                      <p className="text-sm text-destructive">
                        {permissionError}
                      </p>
                    )}
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
                          isEditable={isRoleEditable}
                          onPermissionToggle={handlePermissionToggle}
                          onCategoryToggle={handleCategoryToggle}
                        />
                      )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </form>
        </Form>
      )}
    </div>
  )
}

export default Page
