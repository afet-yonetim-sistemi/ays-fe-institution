'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'
import { formatPhoneNumber } from '@/lib/formatPhoneNumber'
import PrivateRoute from '@/app/hocs/isAuth'
import { Permission } from '@/constants/permissions'
import { FormSchema } from '@/modules/emergencyEvacuationApplications/constants/formSchema'
import { EmergencyEvacuationApplication } from '@/modules/emergencyEvacuationApplications/constants/types'
import { getEmergencyEvacuationApplication } from '@/modules/emergencyEvacuationApplications/service'

const Page = ({ params }: { params: { slug: string; id: string } }) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(FormSchema),
  })
  const { control } = form

  const [
    emergencyEvacuationApplicationDetails,
    setEmergencyEvacuationApplicationDetails,
  ] = useState<EmergencyEvacuationApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetails = () => {
      getEmergencyEvacuationApplication(params.id)
        .then((response) => {
          if (response.data.isSuccess) {
            setEmergencyEvacuationApplicationDetails(response.data.response)
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
  }, [params.id, t, toast])

  return (
    <PrivateRoute requiredPermissions={[Permission.EVACUATION_DETAIL]}>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md text-black dark:text-white">
        {isLoading && <LoadingSpinner />}
        {error && <Toaster />}
        {!isLoading && !error && emergencyEvacuationApplicationDetails && (
          <Form {...form}>
            <form className="space-y-6">
              <h1 className="text-2xl font-bold mb-6">
                {t('emergencyEvacuationApplications.detailsTitle')}
              </h1>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{t('applicationInformation')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                    <FormField
                      control={control}
                      name="referenceNumber"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>{t('referenceNumber')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={
                                emergencyEvacuationApplicationDetails.referenceNumber ??
                                ''
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="nameSurname"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-1">
                          <FormLabel>
                            {t('emergencyEvacuationApplications.nameSurname')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={
                                emergencyEvacuationApplicationDetails.firstName ??
                                '' +
                                  emergencyEvacuationApplicationDetails.lastName ??
                                ''
                              }
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
                                emergencyEvacuationApplicationDetails
                                  ?.phoneNumber?.countryCode &&
                                emergencyEvacuationApplicationDetails
                                  ?.phoneNumber?.lineNumber
                                  ? formatPhoneNumber(
                                      emergencyEvacuationApplicationDetails.phoneNumber,
                                    )
                                  : ''
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {emergencyEvacuationApplicationDetails.isInPerson ? null : (
                      <FormField
                        control={control}
                        name="applicantNameSurname"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-1">
                            <FormLabel>
                              {t('emergencyEvacuationApplications.applicantNameSurname')}
                            </FormLabel>
                            <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={
                                emergencyEvacuationApplicationDetails.applicantFirstName ??
                                '' +
                                  emergencyEvacuationApplicationDetails.applicantLastName ??
                                ''
                              }
                            />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}


{/* GO ON FROM HERE */}



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
                                emergencyEvacuationApplicationDetails.createdUser ??
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
                                emergencyEvacuationApplicationDetails.createdAt
                                  ? formatDateTime(
                                      emergencyEvacuationApplicationDetails.createdAt,
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
                                emergencyEvacuationApplicationDetails.updatedUser ??
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
                                emergencyEvacuationApplicationDetails.updatedAt
                                  ? formatDateTime(
                                      emergencyEvacuationApplicationDetails.updatedAt,
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
                                emergencyEvacuationApplicationDetails
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
                                emergencyEvacuationApplicationDetails
                                  ?.lastName ?? ''
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
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
