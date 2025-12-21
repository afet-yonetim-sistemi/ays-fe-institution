'use client'

import CitySelect from '@/components/CitySelect'
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
import PhoneInput from '@/components/ui/phone-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Permission } from '@/constants/permissions'
import { useDetailPage } from '@/hooks/useDetailPage'
import useFetchRoleSummary from '@/hooks/useFetchRoleSummary'
import { useFormManager } from '@/hooks/useFormManager'
import { formatDateTime } from '@/lib/dataFormatters'
import { selectPermissions } from '@/modules/auth/authSlice'
import { userFormConfig } from '@/modules/users/constants/formConfig'
import { userStatuses } from '@/modules/users/constants/statuses'
import {
  User,
  UserDetails,
  UserEditableFields,
  UserFormValues,
} from '@/modules/users/constants/types'
import {
  activateUser,
  deactivateUser,
  deleteUser,
  getUser,
  updateUser,
} from '@/modules/users/service'
import { useAppSelector } from '@/store/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CountryData } from 'react-phone-input-2'

const Page = ({
  params,
}: {
  params: { slug: string; id: string }
}): JSX.Element => {
  const { t } = useTranslation()
  const userPermissions = useAppSelector(selectPermissions)
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormConfig.validationSchemaDetail),
    mode: 'onChange',
  })
  const { control, reset, getValues } = form

  const { roles, userRolesIsLoading } = useFetchRoleSummary()
  const [initialUserValues, setInitialUserValues] = useState<User | null>(null)
  const [minRoleError, setMinRoleError] = useState<string | null>(null)

  const {
    detail: userDetails,
    isLoading,
    error,
    isEditable: isUserEditable,
    setIsEditable: setIsUserEditable,
    fetchDetails,
    handleUpdate: updateHandler,
    handleActivate: activateHandler,
    handleDeactivate: deactivateHandler,
    handleDelete: deleteHandler,
    handleCancel: cancelHandler,
  } = useDetailPage<User, UserEditableFields>({
    fetchDetail: getUser,
    updateItem: updateUser,
    deleteItem: deleteUser,
    redirectPath: '/users',
    autoRefreshAfterUpdate: true,
    statusOperations: {
      activate: {
        handler: activateUser,
        successStatus: 'ACTIVE',
        successMessage: 'user.activateSuccess',
      },
      deactivate: {
        handler: deactivateUser,
        successStatus: 'PASSIVE',
        successMessage: 'user.deactivateSuccess',
      },
    },
    onSuccess: {
      update: (updatedData) => {
        setInitialUserValues(updatedData)
      },
    },
    successMessages: {
      update: 'user.updateSuccess',
      delete: 'user.deleteSucces',
    },
    errorMessages: {
      update: 'user.updateError',
      fetch: 'common.error.fetch',
    },
  })

  useEffect(() => {
    if (userDetails) {
      setInitialUserValues(userDetails)
      const formDefaults = userFormConfig.getDefaultValues(userDetails)
      reset(formDefaults)
    }
  }, [userDetails, reset])

  const { isSaveButtonDisabled, watchedValues } = useFormManager<
    UserFormValues,
    UserDetails
  >({
    form,
    initialValues: initialUserValues,
    hasFormChanged: (currentValues, initialValues) => {
      const current = userFormConfig.getCurrentValues(
        currentValues,
        currentValues.roleIds || [],
        initialUserValues
      )
      return userFormConfig.hasFormChanged(current, initialValues)
    },
    isSaveButtonDisabled: userFormConfig.isSaveButtonDisabled,
  })

  useEffect(() => {
    fetchDetails(params.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const showActivateButton =
    userPermissions.includes(Permission.USER_UPDATE) &&
    !['NOT_VERIFIED', 'DELETED', 'ACTIVE'].includes(
      userDetails?.status ?? ''
    ) &&
    !isUserEditable

  const showDeactivateButton =
    userPermissions.includes(Permission.USER_UPDATE) &&
    !['NOT_VERIFIED', 'DELETED', 'PASSIVE'].includes(
      userDetails?.status ?? ''
    ) &&
    !isUserEditable

  const showDeleteButton =
    userPermissions.includes(Permission.USER_DELETE) &&
    !['DELETED'].includes(userDetails?.status ?? '') &&
    !isUserEditable

  const showUpdateButton =
    userPermissions.includes(Permission.USER_UPDATE) &&
    !['NOT_VERIFIED', 'DELETED'].includes(userDetails?.status ?? '')

  useEffect(() => {
    const roleIds = watchedValues.roleIds || []
    if (roleIds.length === 0) {
      setMinRoleError(t('user.minRoleError'))
    } else {
      setMinRoleError(null)
    }
  }, [watchedValues.roleIds, t])

  const handleRoleToggle = useCallback(
    (id: string): void => {
      const currentRoleIds = getValues('roleIds') || []
      let newRoleIds: string[]

      if (currentRoleIds.includes(id)) {
        newRoleIds = currentRoleIds.filter((roleId: string) => roleId !== id)
      } else {
        newRoleIds = [...currentRoleIds, id]
      }

      form.setValue('roleIds', newRoleIds, { shouldValidate: true })
    },
    [getValues, form]
  )

  const handleUpdateButtonClick = (): void => {
    setIsUserEditable(true)
  }

  const handleCancelButtonClick = (): void => {
    if (userDetails) {
      reset(userFormConfig.getDefaultValues(userDetails))
    }
    cancelHandler()
  }

  const handleSaveButtonClick = (): void => {
    const formValues = getValues()
    const currentValues = userFormConfig.getCurrentValues(
      formValues,
      formValues.roleIds || [],
      initialUserValues
    )

    const payload = userFormConfig.getPayload(currentValues)
    updateHandler(params.id, payload)
  }

  const handleActivateUser = (): void => {
    activateHandler(params.id)
  }

  const handleDeactivateUser = (): void => {
    deactivateHandler(params.id)
  }

  const handleDeleteUser = (): void => {
    deleteHandler(params.id)
  }

  const renderUpdateButtons = (): JSX.Element | null => {
    if (!showUpdateButton) {
      return null
    }

    return !isUserEditable ? (
      <Button type="button" variant="outline" onClick={handleUpdateButtonClick}>
        {t('common.update')}
      </Button>
    ) : (
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
      {!isLoading && !error && userDetails && (
        <Form {...form}>
          <form className="space-y-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">{t('user.detailsTitle')}</h1>
              <div className="flex items-center gap-4">
                {showActivateButton && (
                  <ButtonDialog
                    triggerText={'common.activate'}
                    title={'user.activateConfirm'}
                    onConfirm={handleActivateUser}
                    variant={'outline'}
                  />
                )}
                {showDeactivateButton && (
                  <ButtonDialog
                    triggerText={'common.deactivate'}
                    title={'user.deactivateConfirm'}
                    onConfirm={handleDeactivateUser}
                    variant={'outline'}
                  />
                )}
                {showDeleteButton && (
                  <ButtonDialog
                    triggerText={'common.delete'}
                    title={'user.deleteConfirm'}
                    onConfirm={handleDeleteUser}
                    variant={'destructive'}
                  />
                )}
                {renderUpdateButtons()}
              </div>
            </div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t('user.information')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
                  <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('common.firstName')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isUserEditable}
                            defaultValue={userDetails.firstName ?? ''}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('common.lastName')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isUserEditable}
                            defaultValue={userDetails.lastName ?? ''}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="emailAddress"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('user.email')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isUserEditable}
                            defaultValue={userDetails.emailAddress ?? ''}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.phoneNumber')}</FormLabel>
                        <FormControl>
                          <PhoneInput
                            disabled={!isUserEditable}
                            value={
                              (field.value?.countryCode ??
                                userDetails?.phoneNumber?.countryCode ??
                                '') +
                              (field.value?.lineNumber ??
                                userDetails?.phoneNumber?.lineNumber ??
                                '')
                            }
                            onChange={(value: string, country: CountryData) => {
                              if (!isUserEditable) return
                              const countryCode: string = country.dialCode
                              const lineNumber: string = value.slice(
                                countryCode.length
                              )
                              field.onChange({ countryCode, lineNumber })
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <CitySelect
                    control={control}
                    defaultValue={userDetails.city}
                    isDisabled={!isUserEditable}
                  />

                  <FormItem className="sm:col-span-1">
                    <FormLabel>{t('user.status')}</FormLabel>
                    <Select value={userDetails.status || ''} disabled>
                      <SelectTrigger>
                        <SelectValue placeholder={t('status.title')} />
                      </SelectTrigger>
                      <SelectContent>
                        {userStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {t(status.label)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                  <div className="grid grid-cols-4 gap-6 sm:col-span-3">
                    <FormItem className="sm:col-span-1">
                      <FormLabel>{t('user.createdUser')}</FormLabel>
                      <Input
                        disabled
                        value={userDetails.createdUser ?? ''}
                        readOnly
                      />
                    </FormItem>
                    <FormItem className="sm:col-span-1">
                      <FormLabel>{t('user.createdAt')}</FormLabel>
                      <Input
                        disabled
                        value={formatDateTime(userDetails.createdAt)}
                        readOnly
                      />
                    </FormItem>
                    <FormItem className="sm:col-span-1">
                      <FormLabel>{t('user.updatedUser')}</FormLabel>
                      <Input
                        disabled
                        value={userDetails.updatedUser ?? ''}
                        readOnly
                      />
                    </FormItem>
                    <FormItem className="sm:col-span-1">
                      <FormLabel>{t('user.updatedAt')}</FormLabel>
                      <Input
                        disabled
                        value={formatDateTime(userDetails.updatedAt ?? '')}
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
                    {isUserEditable ? t('user.role2') : t('user.role')}
                  </CardTitle>
                  <div className="ml-4 flex items-center gap-2">
                    {isUserEditable && minRoleError && (
                      <p className="text-sm text-destructive">{minRoleError}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
                  <FormItem className="sm:col-span-1">
                    <FormControl>
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 gap-1">
                          {userRolesIsLoading ? (
                            <LoadingSpinner />
                          ) : (
                            roles.map((role) => (
                              <FormItem
                                key={role.id}
                                className="flex items-center"
                              >
                                <FormControl>
                                  <Switch
                                    className="mt-2"
                                    checked={(
                                      watchedValues.roleIds || []
                                    ).includes(role.id)}
                                    onCheckedChange={() =>
                                      handleRoleToggle(role.id)
                                    }
                                    disabled={!isUserEditable}
                                  />
                                </FormControl>
                                <FormLabel className="ml-3 items-center">
                                  {role.name}
                                </FormLabel>
                              </FormItem>
                            ))
                          )}
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
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
