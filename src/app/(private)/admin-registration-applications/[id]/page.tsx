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
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { Permission } from '@/constants/permissions'
import { formatDateTime, formatPhoneNumber } from '@/lib/dataFormatters'
import { showErrorToast, showSuccessToast } from '@/lib/showToast'
import { FormValidationSchema } from '@/modules/adminRegistrationApplications/constants/formValidationSchema'
import { AdminRegistrationApplication } from '@/modules/adminRegistrationApplications/constants/types'
import {
  approveAdminRegistrationApplicationWithId,
  getAdminRegistrationApplication,
  rejectAdminRegistrationApplication,
} from '@/modules/adminRegistrationApplications/service'
import { selectPermissions } from '@/modules/auth/authSlice'
import { useAppSelector } from '@/store/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const Page = ({
  params,
}: {
  params: { slug: string; id: string }
}): React.JSX.Element => {
  const { t } = useTranslation()
  const userPermissions = useAppSelector(selectPermissions)
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(FormValidationSchema),
  })
  const { control } = form

  const [
    adminRegistrationApplicationDetails,
    setAdminRegistrationApplicationDetails,
  ] = useState<AdminRegistrationApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const registerCompletionUrl = `${window.location.origin}/register-completion/${params.id}`

  const handleReject = (rejectReason?: string): void | object => {
    const reason = { rejectReason }
    rejectAdminRegistrationApplication(reason, params.id)
      .then(() => {
        showSuccessToast('application.rejectSuccess')
        router.push('/admin-registration-applications')
      })
      .catch((error) => {
        showErrorToast(error)
      })
  }

  const handleApprove = (): void | object => {
    approveAdminRegistrationApplicationWithId(params.id)
      .then(() => {
        showSuccessToast('application.approveSuccess')
        router.push('/admin-registration-applications')
      })
      .catch((error) => {
        showErrorToast(error)
      })
  }

  const handleCopyLink = (): void => {
    navigator.clipboard.writeText(registerCompletionUrl).then(() => {
      showSuccessToast('application.admin.copied')
    })
  }

  useEffect(() => {
    const fetchDetails = (): void => {
      getAdminRegistrationApplication(params.id)
        .then((response) => {
          setAdminRegistrationApplicationDetails(response.response)
        })
        .catch((error) => {
          showErrorToast(error, 'common.error.fetch')
        })
        .finally(() => setIsLoading(false))
    }
    fetchDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md text-black dark:text-white">
      {isLoading && <LoadingSpinner />}
      {!isLoading && adminRegistrationApplicationDetails && (
        <Form {...form}>
          <form className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                {t('application.admin.detailsTitle')}
              </h1>
              {adminRegistrationApplicationDetails.status === 'COMPLETED' &&
                userPermissions.includes(Permission.APPLICATION_CONCLUDE) && (
                  <div className="flex space-x-8 ml-auto">
                    <ButtonDialog
                      triggerText={'common.reject'}
                      title={'application.rejectConfirm'}
                      onConfirm={handleReject}
                      variant={'destructive'}
                      reason={true}
                      tooltipText={'application.admin.rejectTooltip'}
                    />
                    <ButtonDialog
                      triggerText={'common.approve'}
                      title={'application.approveConfirm'}
                      onConfirm={handleApprove}
                      variant={'success'}
                    />
                  </div>
                )}
            </div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t('application.information')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                  <FormField
                    control={control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>{t('application.reason')}</FormLabel>
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
                        <FormLabel>{t('common.institution')}</FormLabel>
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
                        <FormLabel>{t('application.status')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            value={
                              adminRegistrationApplicationDetails?.status
                                ? t(
                                    `status.${adminRegistrationApplicationDetails.status.toLowerCase()}`
                                  )
                                : ''
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
                          <FormLabel>{t('application.rejectReason')}</FormLabel>
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
                        <FormLabel>{t('common.createdUser')}</FormLabel>
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
                        <FormLabel>{t('common.createdAt')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={formatDateTime(
                              adminRegistrationApplicationDetails.createdAt
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
                        <FormLabel>{t('common.updatedUser')}</FormLabel>
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
                        <FormLabel>{t('common.updatedAt')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            defaultValue={formatDateTime(
                              adminRegistrationApplicationDetails.updatedAt
                            )}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {adminRegistrationApplicationDetails.status === 'WAITING' && (
                    <Button
                      type="button"
                      onClick={handleCopyLink}
                      className="sm:col-span-2 text-left"
                    >
                      <span className="truncate flex-grow">
                        {registerCompletionUrl}
                      </span>
                      <span>{t('application.admin.copy')}</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {adminRegistrationApplicationDetails.user && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('user.information')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6 mb-6">
                    <FormField
                      control={control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('common.firstName')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={
                                adminRegistrationApplicationDetails.user
                                  .firstName ?? ''
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
                          <FormLabel>{t('common.lastName')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={
                                adminRegistrationApplicationDetails.user
                                  .lastName ?? ''
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
                          <FormLabel>{t('common.city')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={
                                adminRegistrationApplicationDetails.user.city ??
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
                          <FormLabel>{t('common.phoneNumber')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={
                                adminRegistrationApplicationDetails.user
                                  .phoneNumber
                                  ? formatPhoneNumber(
                                      adminRegistrationApplicationDetails.user
                                        .phoneNumber
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
                          <FormLabel>{t('common.email')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={
                                adminRegistrationApplicationDetails.user
                                  .emailAddress ?? ''
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      )}
    </div>
  )
}

export default Page
