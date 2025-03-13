import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Control, Controller } from 'react-hook-form'
import { t } from 'i18next'
import { CountryData } from 'react-phone-input-2'
import PhoneInput from './ui/phone-input'

interface PhoneNumberFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
}

const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
  control,
  name,
}) => {
  return (
    <Controller
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
