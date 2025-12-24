'use client'

import i18n from '@/i18n'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import type { PhoneInputProps } from 'react-phone-input-2'

// Dynamic import with SSR disabled to prevent class inheritance issues during static export
const ReactPhoneInput = dynamic(
  () => import('react-phone-input-2').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-10 w-full animate-pulse rounded-md bg-gray-200" />
    ),
  }
)

const PhoneInput: React.FC<PhoneInputProps> = (props) => {
  // Load CSS on client side only
  useEffect(() => {
    require('react-phone-input-2/lib/style.css')
  }, [])

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
