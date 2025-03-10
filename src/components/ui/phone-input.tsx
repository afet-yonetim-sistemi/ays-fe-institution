import i18n from '@/i18n'
import { cn } from '@/lib/utils'
import ReactPhoneInput, { PhoneInputProps } from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const PhoneInput: React.FC<PhoneInputProps> = (props) => {
  return (
    <ReactPhoneInput
      {...props}
      country="tr"
      enableSearch={true}
      searchPlaceholder={i18n.t('phoneInput.search')}
      searchNotFound={i18n.t('common.noResult')}
      containerClass={cn('!w-full')}
      countryCodeEditable={false}
      onlyCountries={['tr']}
      disableDropdown
      buttonClass={cn('!pointer-events-none hover:!cursor-not-allowed')}
    />
  )
}

export default PhoneInput
