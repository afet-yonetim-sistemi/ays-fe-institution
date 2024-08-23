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
import { FormValidationSchema } from '@/modules/adminRegistrationApplications/constants/formValidationSchema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { useToast } from '@/components/ui/use-toast'
import { formatPhoneNumber } from '@/lib/formatPhoneNumber'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import PrivateRoute from '@/app/hocs/isAuth'
import { Permission } from '@/constants/permissions'
import usePermissions from '@/app/hocs/usePermissions'

const Page = ({ params }: { params: { slug: string; id: string } }) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const hasPermission = usePermissions([Permission.APPLICATION_CREATE])

  const form = useForm({
    resolver: zodResolver(FormValidationSchema),
  })
  const { control } = form

  const [
    adminRegistrationApplicationDetails,
    setAdminRegistrationApplicationDetails,
  ] = useState<AdminRegistrationApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = () => {
      getAdminRegistrationApplication(params.id)
        .then((response) => {
          setAdminRegistrationApplicationDetails(response.response)
        })
        .catch(() => {
          toast({
            title: t('error'),
            description: t('applicationError'),
            variant: 'destructive',
          })
        })
        .finally(() => setIsLoading(false))
    }
    if (hasPermission) {
      fetchDetails()
    }
  }, [params.id, t, toast, hasPermission])

  return (
    <PrivateRoute requiredPermissions={[Permission.APPLICATION_DETAIL]}>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md text-black dark:text-white">
        {isLoading && <LoadingSpinner />}
        {!isLoading && adminRegistrationApplicationDetails && (
          <Form {...form}>
            <form className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                  {t('adminRegistrationApplications.detailsTitle')}
                </h1>
                {adminRegistrationApplicationDetails.status === 'COMPLETED' && (
                  <div className="flex space-x-8 ml-auto">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive">{t('reject')}</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                          <DialogTitle>{t('rejectConfirm')}</DialogTitle>
                          <DialogDescription />
                        </DialogHeader>
                        <div className="flex justify-center space-x-10 mt-4">
                          <DialogClose asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1"
                            >
                              {t('no')}
                            </Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button type="button" className="flex-1">
                              {t('yes')}
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          className="bg-green-500 text-white hover:bg-green-600"
                        >
                          {t('approve')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                          <DialogTitle>{t('approveConfirm')}</DialogTitle>
                          <DialogDescription />
                        </DialogHeader>
                        <div className="flex justify-center space-x-10 mt-4">
                          <DialogClose asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1"
                            >
                              {t('no')}
                            </Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button type="button" className="flex-1">
                              {t('yes')}
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
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
                          <FormLabel>
                            {t('adminRegistrationApplications.updatedAt')}
                          </FormLabel>
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
                                adminRegistrationApplicationDetails.user
                                  ?.city ?? ''
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
