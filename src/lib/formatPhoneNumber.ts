interface PhoneNumber {
  countryCode?: string
  lineNumber: string
}

export const formatPhoneNumber = (phoneNumber?: PhoneNumber | null): string => {
  if (!phoneNumber) return ''
  const { countryCode = '', lineNumber } = phoneNumber
  const fullNumber = countryCode + lineNumber
  return fullNumber.replace(
    /(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/,
    '+$1 ($2) $3 $4 $5'
  )
}
