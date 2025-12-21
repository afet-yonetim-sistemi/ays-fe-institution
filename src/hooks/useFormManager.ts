import { FieldErrors, FieldValues, UseFormReturn } from 'react-hook-form'

interface UseFormManagerOptions<
  TFormValues extends FieldValues,
  TInitialValues,
> {
  form: UseFormReturn<TFormValues>
  initialValues?: TInitialValues | null
  hasFormChanged: (
    currentValues: TFormValues,
    initialValues: TInitialValues
  ) => boolean
  isSaveButtonDisabled?: (
    isFormChanged: boolean,
    formErrors: FieldErrors<TFormValues>
  ) => boolean
}

interface UseFormManagerReturn<TFormValues> {
  isFormChanged: boolean
  isSaveButtonDisabled: boolean
  watchedValues: TFormValues
}

export function useFormManager<
  TFormValues extends FieldValues,
  TInitialValues,
>({
  form,
  initialValues,
  hasFormChanged,
  isSaveButtonDisabled,
}: UseFormManagerOptions<
  TFormValues,
  TInitialValues
>): UseFormManagerReturn<TFormValues> {
  const { watch, formState } = form
  const watchedValues = watch()

  const isFormChanged = initialValues
    ? hasFormChanged(watchedValues as TFormValues, initialValues)
    : false

  const defaultIsSaveButtonDisabled = (
    isFormChanged: boolean,
    formErrors: FieldErrors<TFormValues>
  ): boolean => {
    return !isFormChanged || Object.keys(formErrors).length > 0
  }

  const isSaveButtonDisabledValue = isSaveButtonDisabled
    ? isSaveButtonDisabled(isFormChanged, formState.errors)
    : defaultIsSaveButtonDisabled(isFormChanged, formState.errors)

  return {
    isFormChanged,
    isSaveButtonDisabled: isSaveButtonDisabledValue,
    watchedValues: watchedValues as TFormValues,
  }
}
