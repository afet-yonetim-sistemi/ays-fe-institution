'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import {
  formatDateTime,
  formatPhoneNumber,
  formatReferenceNumber,
} from '@/lib/dataFormatters'
import { showErrorToast, showSuccessToast } from '@/lib/showToast'
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
  const [showUpdateConfirmDialog, setShowUpdateConfirmDialog] = useState(false)
  const [pendingSaveValues, setPendingSaveValues] =
    useState<EvacuationApplicationEditableFields | null>(null)

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
          showErrorToast(error, 'common.error.fetch')
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
      showErrorToast(undefined, 'common.error.noChange')
      return
    }

    setPendingSaveValues(currentValues)

    if (
      currentValues.status === 'COMPLETED' ||
      currentValues.status === 'CANCELLED'
    ) {
      setShowUpdateConfirmDialog(true)
      return
    }

    handleConfirmSave(currentValues)
  }

  const handleConfirmSave = (
    values: EvacuationApplicationEditableFields = pendingSaveValues!
  ) => {
    if (!values) return

    updateEmergencyEvacuationApplication(params.id, values)
      .then((response) => {
        if (response.isSuccess) {
          setEmergencyEvacuationApplicationDetails((prev) => ({
            ...prev!,
            ...values,
          }))
          setInitialApplicationValues((prev) => ({
            ...prev!,
            ...values,
          }))
          showSuccessToast('application.updateSuccess')
          setIsEmergencyApplicationEditable(false)
          setShowUpdateConfirmDialog(false)
          setPendingSaveValues(null)
        } else {
          showErrorToast(undefined, 'application.updateError')
        }
      })
      .catch((error) => {
        showErrorToast(error, 'application.updateError')
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
                {t('application.evacuation.detailsTitle')}
              </h1>
              {renderUpdateButtons()}
            </div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t('application.information')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
                  <FormField
                    control={control}
                    name="referenceNumber"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>
                          {t('application.evacuation.referenceNumber')}
                        </FormLabel>
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
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('common.fullName')}</FormLabel>
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
                        <FormLabel>{t('common.phoneNumber')}</FormLabel>
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
                            {t('application.evacuation.inPerson')}
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
                      name="applicantFullName"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel>
                            {t('application.evacuation.applicantFullName')}
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
                            {t('application.evacuation.applicantPhone')}
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
                          {t('application.evacuation.sourceCityAndDistrict')}
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
                          {t('application.evacuation.targetCityAndDistrict')}
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
                          {t('application.evacuation.address')}
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
                          {t('application.evacuation.seatingCount')}
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
                          {t('application.evacuation.confirmedSeatingCount')}
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
                        <FormLabel>{t('application.status')}</FormLabel>
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
                              <SelectValue placeholder={t('status.title')} />
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
                        <FormLabel>{t('common.createdAt')}</FormLabel>
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
                            {t('application.evacuation.anyDisability')}
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
                          {t('application.evacuation.notes')}
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
      <Dialog
        open={showUpdateConfirmDialog}
        onOpenChange={setShowUpdateConfirmDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('common.confirmDescription')}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpdateConfirmDialog(false)}
            >
              {t('common.no')}
            </Button>
            <Button onClick={() => handleConfirmSave()}>
              {t('common.yes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Page
