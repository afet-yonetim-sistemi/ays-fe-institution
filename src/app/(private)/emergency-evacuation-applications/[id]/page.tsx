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
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { formatPhoneNumber } from '@/lib/formatPhoneNumber'
import { FormValidationSchema } from '@/modules/emergencyEvacuationApplications/constants/formValidationSchema'
import { EmergencyEvacuationApplication } from '@/modules/emergencyEvacuationApplications/constants/types'
import { getEmergencyEvacuationApplication } from '@/modules/emergencyEvacuationApplications/service'
import { Checkbox } from '@/components/ui/checkbox'
import { formatReferenceNumber } from '@/lib/formatReferenceNumber'
import { handleApiError } from '@/lib/handleApiError'
import { emergencyEvacuationApplicationStatuses } from '@/modules/emergencyEvacuationApplications/constants/statuses'
import { Button } from '@/components/ui/button'
import { selectPermissions } from '@/modules/auth/authSlice'
import { Permission } from '@/constants/permissions'
import { useAppSelector } from '@/store/hooks'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const Page = ({
  params,
}: {
  params: { slug: string; id: string }
}): JSX.Element => {
  const { t } = useTranslation()
  const form = useForm({
    resolver: zodResolver(FormValidationSchema),
    mode: 'onChange',
  })
  const userPermissions = useAppSelector(selectPermissions)
  const { control, reset } = form

  const [
    emergencyEvacuationApplicationDetails,
    setEmergencyEvacuationApplicationDetails,
  ] = useState<EmergencyEvacuationApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEmergencyApplicationEditable, setIsEmergencyApplicationEditable] =
    useState<boolean>(false)

  const canUpdateApplication =
    emergencyEvacuationApplicationDetails?.status !== 'COMPLETED' &&
    emergencyEvacuationApplicationDetails?.status !== 'CANCELLED'

  useEffect(() => {
    const fetchDetails = (): void => {
      getEmergencyEvacuationApplication(params.id)
        .then((response) => {
          setEmergencyEvacuationApplicationDetails(response.response)
        })
        .catch((error) => {
          setError(error.message)
          handleApiError(error, { description: t('error.application') })
        })
        .finally(() => setIsLoading(false))
    }
    fetchDetails()
  }, [params.id, t])

  const handleUpdateButtonClick = (): void => {
    return setIsEmergencyApplicationEditable(true)
  }

  const handleCancelButtonClick = (): void => {
    if (emergencyEvacuationApplicationDetails) {
      reset({
        seatingCount: emergencyEvacuationApplicationDetails.seatingCount,
        hasObstaclePersonExist:
          emergencyEvacuationApplicationDetails.hasObstaclePersonExist,
        status: emergencyEvacuationApplicationDetails.status,
        notes: emergencyEvacuationApplicationDetails.notes,
      })
    }
    setIsEmergencyApplicationEditable(false)
  }

  const handleSaveButtonClick = (): void => {
    return
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md text-black dark:text-white">
      {isLoading && <LoadingSpinner />}
      {!isLoading && !error && emergencyEvacuationApplicationDetails && (
        <Form {...form}>
          <form className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                {t('emergencyEvacuationApplications.detailsTitle')}
              </h1>
              {userPermissions.includes(Permission.EVACUATION_UPDATE) ? (
                canUpdateApplication ? (
                  !isEmergencyApplicationEditable ? (
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
                        disabled={false}
                      >
                        {t('common.save')}
                      </Button>
                    </div>
                  )
                ) : null
              ) : null}
            </div>
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
                            defaultValue={formatReferenceNumber(
                              emergencyEvacuationApplicationDetails.referenceNumber
                            )}
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
                              emergencyEvacuationApplicationDetails.phoneNumber
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
                                emergencyEvacuationApplicationDetails.applicantPhoneNumber
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
                    name="sourceCityAndDistrict"
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
                    name="seatingCount"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>
                          {t('emergencyEvacuationApplications.seatingCount')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            disabled={!isEmergencyApplicationEditable}
                            defaultValue={
                              emergencyEvacuationApplicationDetails.seatingCount ??
                              ''
                            }
                            onChange={(e) => {
                              const value =
                                e.target.value === ''
                                  ? ''
                                  : Number(e.target.value)
                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="confirmedSeatingCount"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>
                          {t(
                            'emergencyEvacuationApplications.confirmedSeatingCount'
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
                          <Select
                            value={
                              field.value ||
                              emergencyEvacuationApplicationDetails.status ||
                              ''
                            }
                            onValueChange={(value: string) =>
                              field.onChange(value)
                            }
                            disabled={!isEmergencyApplicationEditable}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t('status')} />
                            </SelectTrigger>
                            <SelectContent>
                              {emergencyEvacuationApplicationStatuses.map(
                                (status) => (
                                  <SelectItem
                                    key={status.value}
                                    value={status.value}
                                  >
                                    {t(status.label)}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
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
                            defaultValue={formatDateTime(
                              emergencyEvacuationApplicationDetails.createdAt
                            )}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="hasObstaclePersonExist"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <div className="flex items-center">
                          <FormLabel className="mr-2">
                            {t('emergencyEvacuationApplications.anyDisability')}
                          </FormLabel>
                          <FormControl>
                            <Checkbox
                              {...field}
                              disabled={!isEmergencyApplicationEditable}
                              defaultChecked={
                                emergencyEvacuationApplicationDetails.hasObstaclePersonExist
                              }
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="notes"
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
                              emergencyEvacuationApplicationDetails.notes ?? ''
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
