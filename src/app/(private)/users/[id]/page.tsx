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
import useFetchRoleSummary from '@/hooks/useFetchRoleSummary'
import { formatDateTime } from '@/lib/dataFormatters'
import { showErrorToast, showSuccessToast } from '@/lib/showToast'
import { selectPermissions } from '@/modules/auth/authSlice'
import { UserValidationSchema } from '@/modules/users/constants/formValidationSchema'
import { userStatuses } from '@/modules/users/constants/statuses'
import { User, UserEditableFields } from '@/modules/users/constants/types'
import {
  activateUser,
  deactivateUser,
  deleteUser,
  getUser,
  updateUser,
} from '@/modules/users/service'
import { useAppSelector } from '@/store/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(UserValidationSchema),
    mode: 'onChange',
  })
  const userPermissions = useAppSelector(selectPermissions)
  const { control, reset, formState, getValues } = form

  const { roles, userRolesIsLoading } = useFetchRoleSummary()
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [userDetails, setUserDetails] = useState<User | null>(null)
  const [initialUserValues, setInitialUserValues] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUserEditable, setIsUserEditable] = useState<boolean>(false)
  const [minRoleError, setMinRoleError] = useState<string | null>(null)

  const isSaveButtonDisabled =
    Boolean(formState.errors.firstName) ||
    Boolean(formState.errors.lastName) ||
    Boolean(formState.errors.emailAddress) ||
    Boolean(formState.errors.phoneNumber) ||
    Boolean(formState.errors.city) ||
    selectedRoles.length === 0

  const fetchDetails = (): void => {
    setIsLoading(true)
    getUser(params.id)
      .then((response) => {
        const details = response.response
        setUserDetails(details)
        setInitialUserValues(details)
        setSelectedRoles(details.roles.map((role) => role.id))
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
    if (selectedRoles.length === 0) {
      setMinRoleError(t('user.minRoleError'))
    } else {
      setMinRoleError(null)
    }
  }, [selectedRoles, t])

  useEffect(() => {
    fetchDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const handleRoleToggle = useCallback((id: string): void => {
    setSelectedRoles((prevSelectedRoles) => {
      if (prevSelectedRoles.includes(id)) {
        return prevSelectedRoles.filter((roleId) => roleId !== id)
      }
      return [...prevSelectedRoles, id]
    })
  }, [])

  const handleUpdateButtonClick = (): void => {
    return setIsUserEditable(true)
  }

  const handleCancelButtonClick = (): void => {
    if (userDetails) {
      reset({
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        emailAddress: userDetails.emailAddress,
        city: userDetails.city,
        phoneNumber: {
          countryCode: userDetails.phoneNumber?.countryCode ?? '90',
          lineNumber: userDetails.phoneNumber?.lineNumber ?? '',
        },
      })
      setSelectedRoles(userDetails.roles.map((role) => role.id))
    }

    setIsUserEditable(false)
  }

  const handleSaveButtonClick = (): void => {
    const phoneNumberValue = getValues('phoneNumber')

    const currentValues: UserEditableFields = {
      firstName: getValues('firstName') ?? initialUserValues?.firstName,
      lastName: getValues('lastName') ?? initialUserValues?.lastName,
      emailAddress:
        getValues('emailAddress') ?? initialUserValues?.emailAddress,
      city: getValues('city') ?? initialUserValues?.city,
      phoneNumber: {
        countryCode: phoneNumberValue?.countryCode ?? '90',
        lineNumber:
          phoneNumberValue?.lineNumber ??
          initialUserValues?.phoneNumber.lineNumber,
      },
      roleIds: selectedRoles,
    }

    const editableFields: (keyof UserEditableFields)[] = [
      'firstName',
      'lastName',
      'emailAddress',
      'city',
      'phoneNumber',
      'roleIds',
    ]

    const isChanged = editableFields.some((key) => {
      if (key === 'phoneNumber') {
        return (
          currentValues.phoneNumber.countryCode !==
            initialUserValues?.phoneNumber?.countryCode ||
          currentValues.phoneNumber.lineNumber !==
            initialUserValues?.phoneNumber?.lineNumber
        )
      }
      if (key === 'roleIds') {
        const initialRoleIds =
          initialUserValues?.roles.map((role) => role.id) || []

        return (
          JSON.stringify(
            currentValues.roleIds.toSorted((a, b) => a.localeCompare(b))
          ) !==
          JSON.stringify(initialRoleIds.toSorted((a, b) => a.localeCompare(b)))
        )
      }
      return currentValues[key] !== initialUserValues?.[key]
    })

    if (!isChanged) {
      showErrorToast(undefined, 'common.error.noChange')
      return
    }

    updateUser(params.id, currentValues)
      .then((response) => {
        if (response.isSuccess) {
          setUserDetails({
            ...userDetails!,
            ...currentValues,
          })
          setInitialUserValues({
            ...userDetails!,
            ...currentValues,
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
    <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md text-black dark:text-white">
      {isLoading && <LoadingSpinner />}
      {!isLoading && !error && userDetails && (
        <Form {...form}>
          <form className="space-y-6">
            <div className="flex justify-between items-center mb-6">
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
                  <div className="sm:col-span-3 grid grid-cols-4 gap-6">
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
                          <FormLabel>{t('common.createdAt')}</FormLabel>
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
                  <CardTitle>{t('user.role')}</CardTitle>
                  <div className="ml-4 flex items-center gap-2">
                    {isUserEditable && minRoleError && (
                      <p className="text-destructive text-sm">{minRoleError}</p>
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
                                    checked={selectedRoles.includes(role.id)}
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
