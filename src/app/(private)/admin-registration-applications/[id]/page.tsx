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
import { useDetailPage } from '@/hooks/useDetailPage'
import { formatDateTime, formatPhoneNumber } from '@/lib/dataFormatters'
import { showErrorToast, showSuccessToast } from '@/lib/showToast'
import { adminRegistrationApplicationFormConfig } from '@/modules/adminRegistrationApplications/constants/formConfig'
import { AdminRegistrationApplicationStatus } from '@/modules/adminRegistrationApplications/constants/statuses'
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
import React, { useEffect, use } from 'react';
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const Page = (props: { params: Promise<{ id: string }> }): React.React.ReactNode => {
  const params = use(props.params);
  const { t } = useTranslation()
  const userPermissions = useAppSelector(selectPermissions)
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(
      adminRegistrationApplicationFormConfig.detailsValidationSchema
    ),
  })
  const { control } = form

  const {
    detail: adminRegistrationApplicationDetails,
    isLoading,
    fetchDetails,
  } = useDetailPage<AdminRegistrationApplication, object>({
    fetchDetail: getAdminRegistrationApplication,
    updateItem: () => Promise.resolve({ isSuccess: true, time: '' }),
  })

  useEffect(() => {
    fetchDetails(params.id)
  }, [params.id, fetchDetails])

  const getRegisterCompletionUrl = (): string => {
    if (typeof window === 'undefined') return ''
    return `${window.location.origin}/register-completion/${params.id}`
  }

  const handleReject = (rejectReason?: string): void => {
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

  const handleApprove = (): void => {
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
    navigator.clipboard.writeText(getRegisterCompletionUrl()).then(() => {
      showSuccessToast('application.admin.copied')
    })
  }

  return (
    <div className="rounded-md bg-white p-6 text-black shadow-md dark:bg-gray-800 dark:text-white">
      {isLoading && <LoadingSpinner />}
      {!isLoading && adminRegistrationApplicationDetails && (
        <Form {...form}>
          <form className="space-y-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                {t('application.admin.detailsTitle')}
              </h1>
              {adminRegistrationApplicationDetails.status ===
                AdminRegistrationApplicationStatus.COMPLETED &&
                userPermissions.includes(Permission.APPLICATION_CONCLUDE) && (
                  <div className="ml-auto flex space-x-8">
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
                    AdminRegistrationApplicationStatus.REJECTED && (
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
                  {adminRegistrationApplicationDetails.status ===
                    AdminRegistrationApplicationStatus.WAITING && (
                    <Button
                      type="button"
                      onClick={handleCopyLink}
                      className="text-left sm:col-span-2"
                    >
                      <span className="flex-grow truncate">
                        {getRegisterCompletionUrl()}
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
                  <div className="mb-6 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
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
