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
import { useToast } from '@/components/ui/use-toast'
import { formatPhoneNumber } from '@/lib/formatPhoneNumber'
import PrivateRoute from '@/app/hocs/isAuth'
import { Permission } from '@/constants/permissions'
import { FormValidationSchema } from '@/modules/emergencyEvacuationApplications/constants/formValidationSchema'
import { EmergencyEvacuationApplication } from '@/modules/emergencyEvacuationApplications/constants/types'
import { getEmergencyEvacuationApplication } from '@/modules/emergencyEvacuationApplications/service'
import { Checkbox } from '@/components/ui/checkbox'
import { getStatusLabel } from '@/modules/emergencyEvacuationApplications/components/status'
import { formatReferenceNumber } from '@/lib/formatReferenceNumber'

const Page = ({
  params,
}: {
  params: { slug: string; id: string }
}): JSX.Element => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(FormValidationSchema),
  })
  const { control } = form

  const [
    emergencyEvacuationApplicationDetails,
    setEmergencyEvacuationApplicationDetails,
  ] = useState<EmergencyEvacuationApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetails = (): void => {
      getEmergencyEvacuationApplication(params.id)
        .then((response) => {
          setEmergencyEvacuationApplicationDetails(response.response)
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
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
                    <FormField
                      control={control}
                      name="referenceNumber"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-1">
                          <FormLabel>{t('referenceNumber')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={
                                emergencyEvacuationApplicationDetails?.referenceNumber ?
                                  formatReferenceNumber(
                                    emergencyEvacuationApplicationDetails.referenceNumber
                                  )
                                  :
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
                                (emergencyEvacuationApplicationDetails.firstName ??
                                  '') +
                                (emergencyEvacuationApplicationDetails.firstName &&
                                  emergencyEvacuationApplicationDetails.lastName
                                  ? ' '
                                  : '') +
                                (emergencyEvacuationApplicationDetails.lastName ??
                                  '')
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
                                    emergencyEvacuationApplicationDetails.phoneNumber
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
                      name="isInPerson"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-3 mb-6">
                          <div className="flex items-center">
                            <FormLabel className="mr-2">
                              {t('emergencyEvacuationApplications.isInPerson')}
                            </FormLabel>
                            <FormControl>
                              <Checkbox
                                {...field}
                                disabled
                                checked={
                                  emergencyEvacuationApplicationDetails.isInPerson
                                }
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  {!emergencyEvacuationApplicationDetails.isInPerson && (
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 mb-6">
                      <FormField
                        control={control}
                        name="applicantNameSurname"
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <FormLabel>
                              {t(
                                'emergencyEvacuationApplications.applicantNameSurname'
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled
                                defaultValue={
                                  (emergencyEvacuationApplicationDetails.applicantFirstName ??
                                    '') +
                                  (emergencyEvacuationApplicationDetails.applicantFirstName &&
                                    emergencyEvacuationApplicationDetails.applicantLastName
                                    ? ' '
                                    : '') +
                                  (emergencyEvacuationApplicationDetails.applicantLastName ??
                                    '')
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="applicantPhoneNumber"
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <FormLabel>
                              {t(
                                'emergencyEvacuationApplications.applicantPhoneNumber'
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled
                                defaultValue={
                                  emergencyEvacuationApplicationDetails
                                    ?.applicantPhoneNumber?.countryCode &&
                                    emergencyEvacuationApplicationDetails
                                      ?.applicantPhoneNumber?.lineNumber
                                    ? formatPhoneNumber(
                                      emergencyEvacuationApplicationDetails.applicantPhoneNumber
                                    )
                                    : ''
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                    <FormField
                      control={control}
                      name="sourcecityAndDistrict"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-1">
                          <FormLabel>
                            {t(
                              'emergencyEvacuationApplications.sourceCityAndDistrict'
                            )}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={
                                (emergencyEvacuationApplicationDetails.sourceCity ??
                                  '') +
                                (emergencyEvacuationApplicationDetails.sourceCity &&
                                  emergencyEvacuationApplicationDetails.sourceDistrict
                                  ? ' / '
                                  : '') +
                                (emergencyEvacuationApplicationDetails.sourceDistrict ??
                                  '')
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="targetCityAndDistrict"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-1">
                          <FormLabel>
                            {t(
                              'emergencyEvacuationApplications.targetCityAndDistrict'
                            )}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={
                                (emergencyEvacuationApplicationDetails.targetCity ??
                                  '') +
                                (emergencyEvacuationApplicationDetails.targetCity &&
                                  emergencyEvacuationApplicationDetails.targetDistrict
                                  ? ' / '
                                  : '') +
                                (emergencyEvacuationApplicationDetails.targetDistrict ??
                                  '')
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>
                            {t('emergencyEvacuationApplications.address')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={
                                emergencyEvacuationApplicationDetails.address ??
                                ''
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="seatCount"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-1">
                          <FormLabel>{t('seatingCount')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={
                                emergencyEvacuationApplicationDetails.seatingCount ??
                                ''
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="confirmedSeatCount"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-1">
                          <FormLabel>
                            {t(
                              'emergencyEvacuationApplications.confirmedSeatCount'
                            )}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={
                                emergencyEvacuationApplicationDetails.seatingCount ??
                                ''
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
                            {t('emergencyEvacuationApplications.status')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              value={
                                emergencyEvacuationApplicationDetails.status
                                  ? t(
                                    getStatusLabel(
                                      emergencyEvacuationApplicationDetails.status
                                    )
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
                      name="createdAt"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-1">
                          <FormLabel>
                            {t('emergencyEvacuationApplications.createdAt')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={
                                emergencyEvacuationApplicationDetails.createdAt
                                  ? formatDateTime(
                                    emergencyEvacuationApplicationDetails.createdAt
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
                      name="anyDisability"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-1">
                          <div className="flex items-center">
                            <FormLabel className="mr-2">
                              {t(
                                'emergencyEvacuationApplications.anyDisability'
                              )}
                            </FormLabel>
                            <FormControl>
                              <Checkbox
                                {...field}
                                disabled
                                checked={
                                  emergencyEvacuationApplicationDetails.hasObstaclePersonExist
                                }
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="operatorNotes"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>
                            {t('emergencyEvacuationApplications.notes')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              defaultValue={
                                emergencyEvacuationApplicationDetails.notes ??
                                ''
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
