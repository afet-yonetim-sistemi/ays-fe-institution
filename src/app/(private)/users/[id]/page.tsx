'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { formatDateTime } from '@/lib/formatDateTime'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { formatPhoneNumber } from '@/lib/formatPhoneNumber'
import { handleApiError } from '@/lib/handleApiError'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserValidationSchema } from '@/modules/users/constants/formValidationSchema'
import { User } from '@/modules/users/constants/types'
import { getUser } from '@/modules/users/service'
import { userStatuses } from '@/modules/users/constants/statuses'

/* ********************************
Commented out parts will be useful while implementing the user update feature
******************************** */

const Page = ({
  params,
}: {
  params: { slug: string; id: string }
}): JSX.Element => {
  const { t } = useTranslation()
  const form = useForm({
    resolver: zodResolver(UserValidationSchema),
    mode: 'onChange',
  })
  //   const userPermissions = useAppSelector(selectPermissions)
  //   const { control, reset, formState, getValues } = form // use this with update
  const { control } = form // delete this with update

  const [userDetails, setUserDetails] = useState<User | null>(null)
  //   const [initialUserValues, setInitialUserValues] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  //   const [isUserEditable, setIsUserEditable] = useState<boolean>(false)

  useEffect(() => {
    const fetchDetails = (): void => {
      getUser(params.id)
        .then((response) => {
          const details = response.response
          setUserDetails(details)
          //   setInitialUserValues(details)
        })
        .catch((error) => {
          setError(error.message)
          handleApiError(error, { description: t('error.userDetailFetch') })
        })
        .finally(() => setIsLoading(false))
    }
    fetchDetails()
  }, [params.id, t])

  //   const handleUpdateButtonClick = (): void => {
  //     return setIsUserEditable(true)
  //   }

  //   const handleCancelButtonClick = (): void => {
  //     if (userDetails) {
  //       //   reset({})
  //     }
  //     setIsUserEditable(false)
  //   }

  //   const handleSaveButtonClick = (): void => {
  //     const currentValues: EvacuationApplicationEditableFields = {
  //       seatingCount:
  //         getValues('seatingCount') || initialApplicationValues?.seatingCount,
  //       hasObstaclePersonExist:
  //         getValues('hasObstaclePersonExist') ??
  //         initialApplicationValues?.hasObstaclePersonExist,
  //       status: getValues('status') || initialApplicationValues?.status,
  //       notes: getValues('notes') || initialApplicationValues?.notes,
  //     }

  //     const editableFields: (keyof EvacuationApplicationEditableFields)[] = [
  //       'seatingCount',
  //       'hasObstaclePersonExist',
  //       'status',
  //       'notes',
  //     ]

  //     const isChanged = editableFields.some((key) => {
  //       return currentValues[key] !== initialApplicationValues?.[key]
  //     })

  //     if (!isChanged) {
  //       toast({
  //         title: t('common.error'),
  //         description: t('emergencyEvacuationApplications.noChangesError'),
  //         variant: 'destructive',
  //       })
  //       return
  //     }
  //     updateEmergencyEvacuationApplication(params.id, currentValues)
  //       .then((response) => {
  //         if (response.isSuccess) {
  //           setEmergencyEvacuationApplicationDetails({
  //             ...emergencyEvacuationApplicationDetails!,
  //             ...currentValues,
  //           })
  //           setInitialApplicationValues({
  //             ...emergencyEvacuationApplicationDetails!,
  //             ...currentValues,
  //           })

  //           toast({
  //             title: t('success'),
  //             description: t(
  //               'emergencyEvacuationApplications.updatedSuccessfully'
  //             ),
  //             variant: 'success',
  //           })
  //           setIsEmergencyApplicationEditable(false)
  //         } else {
  //           handleApiError(undefined, {
  //             description: t('emergencyEvacuationApplications.updateError'),
  //           })
  //         }
  //       })
  //       .catch((error) => {
  //         handleApiError(error, {
  //           description: t('emergencyEvacuationApplications.updateError'),
  //         })
  //       })
  //   }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md text-black dark:text-white">
      {isLoading && <LoadingSpinner />}
      {!isLoading && !error && userDetails && (
        <Form {...form}>
          <form className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{t('user.detailsTitle')}</h1>
              {/* {userPermissions.includes(Permission.USER_UPDATE) ? (
                canUpdateUser ? (
                  !isUserEditable ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUpdateButtonClick}
                    >
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
                        disabled={Boolean(formState.errors.seatingCount)}
                      >
                        {t('common.save')}
                      </Button>
                    </div>
                  )
                ) : null
              ) : null} */}
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
                        <FormLabel>{t('user.firstName')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={userDetails.firstName ?? ''}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('user.lastName')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={userDetails.lastName ?? ''}
                          />
                        </FormControl>
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
                            disabled
                            defaultValue={userDetails.emailAddress ?? ''}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('phoneNumber')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={
                              userDetails.phoneNumber
                                ? formatPhoneNumber(userDetails.phoneNumber)
                                : ''
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('user.city')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={userDetails.city ?? ''}
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
                        <FormLabel>{t('user.status')}</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value || userDetails.status || ''}
                            onValueChange={(value: string) =>
                              field.onChange(value)
                            }
                            disabled={true} // change with !isUserEditable
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t('status')} />
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
                          <FormLabel>{t('common.updatedAt')}</FormLabel>
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
                <CardTitle>{t('user.roles')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
                  <FormItem className="sm:col-span-1">
                    <FormControl>
                      <div className="space-y-2">
                        {userDetails.roles?.length > 0 ? (
                          userDetails.roles.map((role) => (
                            <div key={role.id}>{role.name}</div>
                          ))
                        ) : (
                          <div className="text-destructive">
                            {t('user.noRoles')}
                          </div>
                        )}
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
