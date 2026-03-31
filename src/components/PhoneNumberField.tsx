import { PhoneNumber } from '@/common/types'
import PhoneInput from '@/components/custom/phone-input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shadcn/ui/form'
import { t } from 'i18next'
import { Control, FieldPathByValue, FieldValues } from 'react-hook-form'
import { CountryData } from 'react-phone-input-2'

interface PhoneNumberFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  control: Control<TFieldValues>
  name?: FieldPathByValue<TFieldValues, PhoneNumber | null | undefined>
}

const PhoneNumberField = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name = 'phoneNumber' as FieldPathByValue<
    TFieldValues,
    PhoneNumber | null | undefined
  >,
}: PhoneNumberFieldProps<TFieldValues>): React.ReactNode => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{t('common.phoneNumber')}</FormLabel>
          <FormControl>
            <PhoneInput
              value={
                (field.value?.countryCode || '') +
                (field.value?.lineNumber || '')
              }
              onChange={(value: string, country: CountryData) => {
                const countryCode = country.dialCode
                const lineNumber = value.slice(countryCode.length)
                field.onChange({ countryCode, lineNumber })
              }}
            />
          </FormControl>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  )
}

export default PhoneNumberField
