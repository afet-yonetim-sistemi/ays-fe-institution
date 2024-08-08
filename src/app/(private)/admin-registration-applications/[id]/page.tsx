'use client'

import { useEffect, useState } from 'react'
import { getAdminRegistrationApplication } from '@/modules/adminRegistrationApplications/service'
import { Input } from '@/components/ui/input'
import { AdminRegistrationApplication } from '@/modules/adminRegistrationApplications/constants/types'
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
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'
import { formatPhoneNumber } from '@/lib/formatPhoneNumber'
import PrivateRoute from '@/app/hocs/isAuth'
import { Permission } from '@/constants/permissions'

const Page = ({ params }: { params: { slug: string; id: string } }) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(FormSchema),
  })
  const { control } = form

  const [
    adminRegistrationApplicationDetails,
    setAdminRegistrationApplicationDetails,
  ] = useState<AdminRegistrationApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetails = () => {
      getAdminRegistrationApplication(params.id)
        .then((response) => {
          if (response.data.isSuccess) {
            setAdminRegistrationApplicationDetails(response.data.response)
          } else {
            setError(t('applicationError'))
            toast({
              title: t('error'),
              description: t('applicationError'),
              variant: 'destructive',
            })
          }
        })
        .catch((error) => {
          setError(error.message)
          toast({
            title: t('error'),
            description: t('applicationError'),
            variant: 'destructive',
          })
        })
        .finally(() => setIsLoading(false))
    }

    fetchDetails()
  }, [params.id])

  return (
    <PrivateRoute requiredPermissions={[Permission.APPLICATION_DETAIL]}>
    <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md text-black dark:text-white">
      {isLoading && <LoadingSpinner />}
      {error && <Toaster />}
      {!isLoading && !error && adminRegistrationApplicationDetails && (
        <Form {...form}>
          <form className="space-y-6">
            <h1 className="text-2xl font-bold mb-6">
              {t('applicationDetailsTitle')}
            </h1>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t('applicationInformation')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                  <FormField
                    control={control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>{t('reason')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={
                              adminRegistrationApplicationDetails.reason ?? ''
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="institutionName"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('institution')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={
                              adminRegistrationApplicationDetails.institution
                                ?.name ?? ''
                            }
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
                        <FormLabel>{t('applicationStatus')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            value={
                              t(
                                adminRegistrationApplicationDetails.status.toLowerCase(),
                              ) ?? ''
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {adminRegistrationApplicationDetails.status ===
                    'REJECTED' && (
                    <FormField
                      control={control}
                      name="rejectReason"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>{t('rejectReason')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={
                                adminRegistrationApplicationDetails.rejectReason ??
                                ''
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={control}
                    name="createdUser"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('applicationCreatedUser')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={
                              adminRegistrationApplicationDetails.createdUser ??
                              ''
                            }
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
                        <FormLabel>{t('createDate')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={
                              adminRegistrationApplicationDetails.createdAt
                                ? formatDateTime(
                                    adminRegistrationApplicationDetails.createdAt,
                                  )
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
                        <FormLabel>{t('updatedUser')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={
                              adminRegistrationApplicationDetails.updatedUser ??
                              ''
                            }
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
                        <FormLabel>{t('updateDate')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={
                              adminRegistrationApplicationDetails.updatedAt
                                ? formatDateTime(
                                    adminRegistrationApplicationDetails.updatedAt,
                                  )
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

            <Card>
              <CardHeader>
                <CardTitle>{t('userInformation')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6 mb-6">
                  <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('firstName')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={
                              adminRegistrationApplicationDetails.user
                                ?.firstName ?? ''
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('lastName')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={
                              adminRegistrationApplicationDetails.user
                                ?.lastName ?? ''
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="userCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('city')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={
                              adminRegistrationApplicationDetails.user?.city ??
                              ''
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                  <FormField
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('phoneNumber')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={
                              adminRegistrationApplicationDetails.user
                                ?.phoneNumber?.countryCode &&
                              adminRegistrationApplicationDetails.user
                                ?.phoneNumber?.lineNumber
                                ? formatPhoneNumber(
                                    adminRegistrationApplicationDetails.user
                                      .phoneNumber,
                                  )
                                : ''
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="userEmailAddress"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('emailAddress')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={
                              adminRegistrationApplicationDetails.user
                                ?.emailAddress ?? ''
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
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
