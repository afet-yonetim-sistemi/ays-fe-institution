/* eslint-disable max-lines-per-function, @typescript-eslint/explicit-function-return-type, complexity */
'use client'

import CitySelect from '@/components/CitySelect'
import {
  Button,
  ButtonDialog,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  LoadingSpinner,
  PhoneInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@/components/ui'
import { Permission } from '@/constants/permissions'
import useFetchRoleSummary from '@/hooks/useFetchRoleSummary'
import { formatDateTime } from '@/lib/dataFormatters'
import { showErrorToast, showSuccessToast } from '@/lib/showToast'
import { selectPermissions } from '@/modules/auth/authSlice'
import { userFormConfig } from '@/modules/users/constants/formConfig'
import { userStatuses } from '@/modules/users/constants/statuses'
import { User } from '@/modules/users/constants/types'
import {
  activateUser,
  deactivateUser,
  deleteUser,
  getUser,
  updateUser,
} from '@/modules/users/service'
import { useAppSelector } from '@/store/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CountryData } from 'react-phone-input-2'

const PageContent = (): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id') as string // TODO: Handle null
  const params = { id }
  const form = useForm({
    resolver: zodResolver(userFormConfig.validationSchemaDetail),
    mode: 'onChange',
  })
  const userPermissions = useAppSelector(selectPermissions)
  const { control, reset, formState, getValues, watch } = form
  const watchedValues = watch()

  const { roles, userRolesIsLoading } = useFetchRoleSummary()
  const [userDetails, setUserDetails] = useState<User | null>(null)
  const [initialUserValues, setInitialUserValues] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUserEditable, setIsUserEditable] = useState<boolean>(false)
  const [minRoleError, setMinRoleError] = useState<string | null>(null)
  const [isFormChanged, setIsFormChanged] = useState(false)

  useEffect(() => {
    if (!initialUserValues) return

    const currentValues = userFormConfig.getCurrentValues(
      watchedValues,
      watchedValues.roleIds || [],
      initialUserValues
    )

    const formChanged = userFormConfig.hasFormChanged(
      currentValues,
      initialUserValues
    )
    setIsFormChanged(formChanged)
  }, [watchedValues, initialUserValues])

  const isSaveButtonDisabled = userFormConfig.isSaveButtonDisabled(
    isFormChanged,
    formState.errors
  )

  const fetchDetails = (): void => {
    setIsLoading(true)
    getUser(params.id)
      .then((response) => {
        const details = response.response
        setUserDetails(details)
        setInitialUserValues(details)
        const formDefaults = userFormConfig.getDefaultValues(details)
        reset(formDefaults)
      })
      .catch((error) => {
        setError(error.message)
        showErrorToast(error, 'common.error.fetch')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

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

  useEffect(() => {
    fetchDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

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
    return setIsUserEditable(true)
  }

  const handleCancelButtonClick = (): void => {
    if (userDetails) {
      reset(userFormConfig.getDefaultValues(userDetails))
    }

    setIsUserEditable(false)
  }

  const handleSaveButtonClick = (): void => {
    const formValues = getValues()
    const currentValues = userFormConfig.getCurrentValues(
      formValues,
      formValues.roleIds || [],
      initialUserValues
    )

    const payload = userFormConfig.getPayload(currentValues)

    updateUser(params.id, payload)
      .then((response) => {
        if (response.isSuccess) {
          setUserDetails({
            ...userDetails!,
            ...payload,
          })
          setInitialUserValues({
            ...userDetails!,
            ...payload,
          })

          showSuccessToast('user.updateSuccess')
          setIsUserEditable(false)
          fetchDetails()
        } else {
          showErrorToast(undefined, 'user.updateError')
        }
      })
      .catch((error) => {
        showErrorToast(error, 'user.updateError')
      })
  }

  const handleActivateUser = (): void => {
    activateUser(params.id)
      .then((response) => {
        if (response.isSuccess) {
          showSuccessToast('user.activateSuccess')
          if (userDetails) {
            setUserDetails({
              ...userDetails,
              status: 'ACTIVE',
            })
          }
        } else {
          showErrorToast()
        }
      })
      .catch((error) => {
        showErrorToast(error)
      })
  }

  const handleDeactivateUser = (): void => {
    deactivateUser(params.id)
      .then((response) => {
        if (response.isSuccess) {
          showSuccessToast('user.deactivateSuccess')
          if (userDetails) {
            setUserDetails({
              ...userDetails,
              status: 'PASSIVE',
            })
          }
        } else {
          showErrorToast()
        }
      })
      .catch((error) => {
        showErrorToast(error)
      })
  }

  const handleDeleteUser = (): void => {
    deleteUser(params.id)
      .then((response) => {
        if (response.isSuccess) {
          showSuccessToast('user.deleteSucces')
          router.push('/users')
        } else {
          showErrorToast()
        }
      })
      .catch((error) => {
        showErrorToast(error)
      })
  }

  const renderUpdateButtons = () => {
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

                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('user.status')}</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value || userDetails.status || ''}
                            onValueChange={(value: string) =>
                              field.onChange(value)
                            }
                            disabled
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t('status.title')} />
                            </SelectTrigger>
                            <SelectContent>
                              {userStatuses.map((status) => (
                                <SelectItem
                                  key={status.value}
                                  value={status.value}
                                >
                                  {t(status.label)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-4 gap-6 sm:col-span-3">
                    <FormField
                      control={control}
                      name="createdUser"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-1">
                          <FormLabel>{t('user.createdUser')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={userDetails.createdUser ?? ''}
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
                          <FormLabel>{t('user.createdAt')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={formatDateTime(
                                userDetails.createdAt
                              )}
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
                          <FormLabel>{t('user.updatedUser')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={userDetails.updatedUser ?? ''}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="updatedAt"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-1">
                          <FormLabel>{t('user.updatedAt')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={formatDateTime(
                                userDetails.updatedAt
                              )}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
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

const Page = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <PageContent />
  </Suspense>
)

export default Page
