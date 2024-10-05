'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  approveAdminRegistrationApplicationWithId,
  getAdminRegistrationApplication,
  rejectAdminRegistrationApplication,
} from '@/modules/adminRegistrationApplications/service'
import { Input } from '@/components/ui/input'
import { AdminRegistrationApplication } from '@/modules/adminRegistrationApplications/constants/types'
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
import { FormValidationSchema } from '@/modules/adminRegistrationApplications/constants/formValidationSchema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { useToast } from '@/components/ui/use-toast'
import { formatPhoneNumber } from '@/lib/formatPhoneNumber'
import ButtonDialog from '@/components/ui/button-dialog'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/store/hooks'
import { selectPermissions } from '@/modules/auth/authSlice'
import { Permission } from '@/constants/permissions'
import { handleApiError } from '@/lib/handleApiError'

const Page = ({
  params,
}: {
  params: { slug: string; id: string }
}): React.JSX.Element => {
  const { t } = useTranslation()
  const { toast } = useToast()
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
        toast({
          title: t('success'),
          description: t('applicationRejectSuccess'),
          variant: 'success',
        })
        router.push('/admin-registration-applications')
      })
      .catch((error) => {
        handleApiError(error)
      })
  }

  const handleApprove = (): void | object => {
    approveAdminRegistrationApplicationWithId(params.id)
      .then(() => {
        toast({
          title: t('success'),
          description: t('applicationApproveSuccess'),
          variant: 'success',
        })
        router.push('/admin-registration-applications')
      })
      .catch((error) => {
        handleApiError(error)
      })
  }

  const handleCopyLink = (): void => {
    navigator.clipboard.writeText(registerCompletionUrl).then(() => {
      toast({
        title: t('success'),
        description: `${t('adminRegistrationApplications.linkCopied')}`,
        variant: 'success',
      })
    })
  }

  useEffect(() => {
    const fetchDetails = (): void => {
      getAdminRegistrationApplication(params.id)
        .then((response) => {
          setAdminRegistrationApplicationDetails(response.response)
        })
        .catch((error) => {
          handleApiError(error, { description: t('error.application') })
        })
        .finally(() => setIsLoading(false))
    }
    fetchDetails()
  }, [params.id, t])

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md text-black dark:text-white">
      {isLoading && <LoadingSpinner />}
      {!isLoading && adminRegistrationApplicationDetails && (
        <Form {...form}>
          <form className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                {t('adminRegistrationApplications.detailsTitle')}
              </h1>
              {adminRegistrationApplicationDetails.status === 'COMPLETED' &&
                userPermissions.includes(Permission.APPLICATION_CONCLUDE) && (
                  <div className="flex space-x-8 ml-auto">
                    <ButtonDialog
                      triggerText={'reject'}
                      title={'rejectConfirm'}
                      onConfirm={handleReject}
                      variant={'destructive'}
                      reason={true}
                      tooltipText={'rejectReasonLengthInfo'}
                    />
                    <ButtonDialog
                      triggerText={'approve'}
                      title={'approveConfirm'}
                      onConfirm={handleApprove}
                      variant={'success'}
                    />
                  </div>
                )}
            </div>
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
                        <FormLabel>
                          {t('adminRegistrationApplications.reason')}
                        </FormLabel>
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
                        <FormLabel>{t('institutionName')}</FormLabel>
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
                        <FormLabel>
                          {t('adminRegistrationApplications.status')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            value={
                              adminRegistrationApplicationDetails?.status
                                ? t(
                                    adminRegistrationApplicationDetails.status.toLowerCase()
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
                        <FormLabel>
                          {t('adminRegistrationApplications.createdUser')}
                        </FormLabel>
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
                        <FormLabel>
                          {t('adminRegistrationApplications.createdAt')}
                        </FormLabel>
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
                        <FormLabel>
                          {t('adminRegistrationApplications.updatedAt')}
                        </FormLabel>
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
                      <span>{t('adminRegistrationApplications.copyLink')}</span>
                    </Button>
                  )}
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
                                ?.phoneNumber
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
  )
}

export default Page
