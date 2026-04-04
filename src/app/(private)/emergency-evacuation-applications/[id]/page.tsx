'use client'

import { LoadingSpinner } from '@/components/custom/loadingSpinner'
import Status from '@/components/custom/status'
import { Permission } from '@/constants/permissions'
import {
  formatDateTime,
  formatPhoneNumber,
  formatReferenceNumber,
} from '@/lib/dataFormatters'
import { showErrorToast, showSuccessToast } from '@/lib/showToast'
import { selectPermissions } from '@/modules/auth/authSlice'
import PriorityIcon from '@/modules/emergencyEvacuationApplications/components/PriorityIcon'
import { FormValidationSchema } from '@/modules/emergencyEvacuationApplications/constants/formValidationSchema'
import {
  EMERGENCY_EVACUATION_APPLICATION_PRIORITIES,
  EmergencyEvacuationApplicationPriority,
} from '@/modules/emergencyEvacuationApplications/constants/priorities'
import { emergencyEvacuationApplicationStatuses } from '@/modules/emergencyEvacuationApplications/constants/statuses'
import {
  EmergencyEvacuationApplication,
  EvacuationApplicationEditableFields,
} from '@/modules/emergencyEvacuationApplications/constants/types'
import {
  getEmergencyEvacuationApplication,
  updateEmergencyEvacuationApplication,
} from '@/modules/emergencyEvacuationApplications/service'
import { Button } from '@/shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card'
import { Checkbox } from '@/shadcn/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shadcn/ui/form'
import { Input } from '@/shadcn/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/ui/select'
import { Textarea } from '@/shadcn/ui/textarea'
import { useAppSelector } from '@/store/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const Page = (props: {
  params: Promise<{ slug: string; id: string }>
}): React.ReactNode => {
  const params = use(props.params)
  const { t } = useTranslation()
  const form = useForm({
    resolver: zodResolver(FormValidationSchema),
    mode: 'onChange',
  })
  const userPermissions = useAppSelector(selectPermissions)
  const { control, reset, formState, getValues, watch } = form
  const watchedValues = watch()

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
  const [isFormChanged, setIsFormChanged] = useState(false)

  useEffect(() => {
    if (!initialApplicationValues) return

    const currentValues = {
      seatingCount: watchedValues.seatingCount,
      hasObstaclePersonExist: watchedValues.hasObstaclePersonExist,
      status: watchedValues.status,
      priority: watchedValues.priority ?? initialApplicationValues.priority,
      notes: watchedValues.notes,
    }

    const hasChanged = [
      'seatingCount',
      'hasObstaclePersonExist',
      'status',
      'priority',
      'notes',
    ].some(
      (key) =>
        currentValues[key as keyof EvacuationApplicationEditableFields] !==
        initialApplicationValues[
          key as keyof EvacuationApplicationEditableFields
        ]
    )

    setIsFormChanged(hasChanged)
  }, [watchedValues, initialApplicationValues])

  const canUpdateApplication =
    emergencyEvacuationApplicationDetails?.status !== 'COMPLETED' &&
    emergencyEvacuationApplicationDetails?.status !== 'CANCELLED'

  const isSaveButtonDisabled =
    !isFormChanged ||
    Boolean(formState.errors.seatingCount) ||
    Boolean(formState.errors.priority) ||
    Boolean(formState.errors.notes)

  useEffect(() => {
    const fetchDetails = (): void => {
      getEmergencyEvacuationApplication(params.id)
        .then((response) => {
          const details = response.response
          setEmergencyEvacuationApplicationDetails(details)
          setInitialApplicationValues(details)
          reset({
            seatingCount: details.seatingCount,
            hasObstaclePersonExist: details.hasObstaclePersonExist,
            status: details.status,
            priority: details.priority,
            notes: details.notes,
          })
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
          emergencyEvacuationApplicationDetails.hasObstaclePersonExist,
        status: emergencyEvacuationApplicationDetails.status,
        priority: emergencyEvacuationApplicationDetails.priority,
        notes: emergencyEvacuationApplicationDetails.notes,
      })
    }
    setIsFormChanged(false)
    setIsEmergencyApplicationEditable(false)
  }

  const handleSaveButtonClick = (): void => {
    const currentValues: EvacuationApplicationEditableFields = {
      seatingCount:
        getValues('seatingCount') ?? initialApplicationValues?.seatingCount,
      hasObstaclePersonExist:
        getValues('hasObstaclePersonExist') ??
        initialApplicationValues?.hasObstaclePersonExist ??
        false,
      status: getValues('status') ?? initialApplicationValues?.status ?? '',
      priority:
        (getValues('priority') as EmergencyEvacuationApplicationPriority) ??
        initialApplicationValues?.priority,
      notes: getValues('notes') ?? initialApplicationValues?.notes ?? '',
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
  ): void => {
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
          setIsFormChanged(false)
        } else {
          showErrorToast(undefined, 'application.updateError')
        }
      })
      .catch((error) => {
        showErrorToast(error, 'application.updateError')
      })
  }

  const renderUpdateButtons = (): React.ReactNode => {
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
    <div className="bg-card text-card-foreground rounded-md p-6 shadow-md">
      {isLoading && <LoadingSpinner />}
      {!isLoading && !error && emergencyEvacuationApplicationDetails && (
        <Form {...form}>
          <form className="space-y-6">
            <div className="mb-6 flex items-center justify-between">
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
                            value={
                              field.value
                                ? formatReferenceNumber(field.value)
                                : ''
                            }
                            disabled
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>{t('common.fullName')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            disabled
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
                            value={
                              field.value ? formatPhoneNumber(field.value) : ''
                            }
                            disabled
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="isInPerson"
                    render={({ field }) => (
                      <FormItem className="mb-6 sm:col-span-3">
                        <div className="flex items-center">
                          <FormLabel className="mr-2">
                            {t('application.evacuation.inPerson')}
                          </FormLabel>
                          <FormControl>
                            <Checkbox
                              id={field.name}
                              disabled
                              checked={
                                !!emergencyEvacuationApplicationDetails.isInPerson
                              }
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                {!emergencyEvacuationApplicationDetails.isInPerson && (
                  <div className="mb-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                    <FormField
                      control={control}
                      name="applicantFirstName"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel>
                            {t('application.evacuation.applicantFullName')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ''}
                              disabled
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
                              value={
                                field.value
                                  ? formatPhoneNumber(field.value)
                                  : ''
                              }
                              disabled
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
                    name="sourceCity"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>
                          {t('application.evacuation.sourceCityAndDistrict')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            disabled
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="targetCity"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>
                          {t('application.evacuation.targetCityAndDistrict')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            disabled
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
                            value={field.value ?? ''}
                            disabled
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
                            value={field.value ?? ''}
                            onChange={(e) => {
                              const val =
                                e.target.value === ''
                                  ? ''
                                  : Number(e.target.value)
                              field.onChange(val)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="seatingCount"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>
                          {t('application.evacuation.confirmedSeatingCount')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            disabled
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>
                          {t('application.evacuation.priority')}
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={
                              field.value ||
                              emergencyEvacuationApplicationDetails.priority
                            }
                            onValueChange={(value: string) =>
                              field.onChange(value)
                            }
                            disabled={!isEmergencyApplicationEditable}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  'application.evacuation.priority'
                                )}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(
                                EMERGENCY_EVACUATION_APPLICATION_PRIORITIES
                              ).map((priority) => (
                                <SelectItem
                                  key={priority.value}
                                  value={priority.value}
                                  className="pl-2 [&>.absolute]:hidden"
                                >
                                  <PriorityIcon priority={priority.value} />
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
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
                                    <Status status={status} />
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
                            value={formatDateTime(field.value)}
                            disabled
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="hasObstaclePersonExist"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <div className="flex items-center">
                          <FormLabel className="mr-2">
                            {t('application.evacuation.anyDisability')}
                          </FormLabel>
                          <FormControl>
                            <Checkbox
                              id={field.name}
                              disabled={!isEmergencyApplicationEditable}
                              checked={!!field.value}
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
                            value={field.value ?? ''}
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
