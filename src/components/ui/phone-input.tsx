import i18n from '@/i18n'
import { cn } from '@/lib/utils'
import ReactPhoneInput, { PhoneInputProps } from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const PhoneInput: React.FC<PhoneInputProps> = (props) => {
  return (
    <ReactPhoneInput
      {...props}
      country="tr"
      placeholder={i18n.t('common.phoneNumber')}
      enableSearch={true}
      searchPlaceholder={i18n.t('phoneInput.search')}
      searchNotFound={i18n.t('common.noResult')}
      countryCodeEditable={false}
      onlyCountries={['tr']}
      disableDropdown
      containerClass={cn('!w-full')}
      inputClass={cn('!w-full')}
      buttonClass={cn('!pointer-events-none hover:!cursor-not-allowed')}
    />
  )
}

export { PhoneInput }
