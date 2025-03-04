'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Permission } from '@/constants/permissions'
import { toast } from '@/hooks/useToast'
import {
  formatDateTime,
  formatPhoneNumber,
  formatReferenceNumber,
} from '@/lib/dataFormatters'
import { handleApiError } from '@/lib/handleApiError'
import { selectPermissions } from '@/modules/auth/authSlice'
import { FormValidationSchema } from '@/modules/emergencyEvacuationApplications/constants/formValidationSchema'
import { emergencyEvacuationApplicationStatuses } from '@/modules/emergencyEvacuationApplications/constants/statuses'
import {
  EmergencyEvacuationApplication,
  EvacuationApplicationEditableFields,
} from '@/modules/emergencyEvacuationApplications/constants/types'
import {
  getEmergencyEvacuationApplication,
  updateEmergencyEvacuationApplication,
} from '@/modules/emergencyEvacuationApplications/service'
import { useAppSelector } from '@/store/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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
  const { control, reset, formState, getValues } = form

  const [
    emergencyEvacuationApplicationDetails,
    setEmergencyEvacuationApplicationDetails,
  ] = useState<EmergencyEvacuationApplication | null>(null)
  const [initialApplicationValues, setInitialApplicationValues] =
    useState<EmergencyEvacuationApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEmergencyApplicationEditable, setIsEmergencyApplicationEditable] =
    useState<boolean>(false)

  const canUpdateApplication =
    emergencyEvacuationApplicationDetails?.status !== 'COMPLETED' &&
    emergencyEvacuationApplicationDetails?.status !== 'CANCELLED'

  const isSaveButtonDisabled =
    Boolean(formState.errors.seatingCount) || Boolean(formState.errors.notes)

  useEffect(() => {
    const fetchDetails = (): void => {
      getEmergencyEvacuationApplication(params.id)
        .then((response) => {
          const details = response.response
          const detailsWithoutNullHasObstacle = {
            ...details,
            hasObstaclePersonExist: details.hasObstaclePersonExist || false,
          }
          setEmergencyEvacuationApplicationDetails(
            detailsWithoutNullHasObstacle
          )
          setInitialApplicationValues(detailsWithoutNullHasObstacle)
        })
        .catch((error) => {
          setError(error.message)
          handleApiError(error, { description: 'error.application' })
        })
        .finally(() => setIsLoading(false))
    }
    fetchDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const handleUpdateButtonClick = (): void => {
    return setIsEmergencyApplicationEditable(true)
  }

  const handleCancelButtonClick = (): void => {
    if (emergencyEvacuationApplicationDetails) {
      reset({
        seatingCount: emergencyEvacuationApplicationDetails.seatingCount,
        hasObstaclePersonExist:
          emergencyEvacuationApplicationDetails.hasObstaclePersonExist || false,
        status: emergencyEvacuationApplicationDetails.status,
        notes: emergencyEvacuationApplicationDetails.notes,
      })
    }
    setIsEmergencyApplicationEditable(false)
  }

  const handleSaveButtonClick = (): void => {
    const currentValues: EvacuationApplicationEditableFields = {
      seatingCount:
        getValues('seatingCount') ?? initialApplicationValues?.seatingCount,
      hasObstaclePersonExist:
        getValues('hasObstaclePersonExist') ??
        initialApplicationValues?.hasObstaclePersonExist,
      status: getValues('status') ?? initialApplicationValues?.status,
      notes: getValues('notes') ?? initialApplicationValues?.notes,
    }

    const editableFields: (keyof EvacuationApplicationEditableFields)[] = [
      'seatingCount',
      'hasObstaclePersonExist',
      'status',
      'notes',
    ]

    const isChanged = editableFields.some((key) => {
      return currentValues[key] !== initialApplicationValues?.[key]
    })

    if (!isChanged) {
      handleApiError(undefined, {
        description: 'emergencyEvacuationApplications.noChangesError',
      })
      return
    }
    updateEmergencyEvacuationApplication(params.id, currentValues)
      .then((response) => {
        if (response.isSuccess) {
          setEmergencyEvacuationApplicationDetails({
            ...emergencyEvacuationApplicationDetails!,
            ...currentValues,
          })
          setInitialApplicationValues({
            ...emergencyEvacuationApplicationDetails!,
            ...currentValues,
          })

          toast({
            title: 'success',
            description: 'emergencyEvacuationApplications.updatedSuccessfully',
            variant: 'success',
          })
          setIsEmergencyApplicationEditable(false)
        } else {
          handleApiError(undefined, {
            description: 'emergencyEvacuationApplications.updateError',
          })
        }
      })
      .catch((error) => {
        handleApiError(error, {
          description: 'emergencyEvacuationApplications.updateError',
        })
      })
  }

  const renderUpdateButtons = () => {
    if (!userPermissions.includes(Permission.EVACUATION_UPDATE)) return null
    if (!canUpdateApplication) return null

    return !isEmergencyApplicationEditable ? (
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
      {!isLoading && !error && emergencyEvacuationApplicationDetails && (
        <Form {...form}>
          <form className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                {t('emergencyEvacuationApplications.detailsTitle')}
              </h1>
              {renderUpdateButtons()}
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
                          <Textarea
                            {...field}
                            disabled={!isEmergencyApplicationEditable}
                            defaultValue={
                              emergencyEvacuationApplicationDetails.notes ?? ''
                            }
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
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
